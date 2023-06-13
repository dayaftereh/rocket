import { IncomingMessage } from 'http';
import { LaunchPadComputerState, LaunchPadConfigWebMessage, LaunchPadStatusWebMessage, RocketConfigWebMessage, RocketStatusWebMessage, WebMessage, WebMessageDecoder, WebMessageEncoder, WebMessageType } from 'lrocket/services/web/messages/public-api';
import { ServerOptions, WebSocket, WebSocketServer } from 'ws';

class LaunchComputer {

    private timer: number = 0
    private updateRate: number = 1000.0 / 30.
    private statusTimer: number = 0

    private pressure: number = 0
    private enablePressurising: boolean = false
    private state: LaunchPadComputerState = LaunchPadComputerState.Locked

    private lastRocketState: number = 0
    private lastRocketSignal: number = 0

    private config: LaunchPadConfigWebMessage

    constructor(private readonly launchPad: LaunchPad) {
        this.config = {
            abortClosePressureThreshold: 0.5,
            captivePortal: true,
            honkDuration: 1000,
            launchValveOpenedDuration: 1000,
            ssid: 'Launch-Pad',
            password: 'Password1234',
            pressureDropLimit: 0.75,
            pressureFactor: 1.0,
            pressureOffset: 0.0,
            pressurisingTimeout: 40 * 1000,
            rocketConnectedState: 0,
            rocketConnectingTimeout: 5000,
            rocketSignalElapsedThreshold: 1000,
            rocketStartupState: 0,
            rocketStartupTimeout: 15 * 1000,
            startupTimeout: 5 * 1000,
            tankChillDuration: 5 * 1000,
            targetPressure: 10.0,
            type: WebMessageType.LaunchPadConfig,
            voltageFactor: 1.0,
            voltageOffset: 0.0,
            voltageLimit: 10.0,

        } as LaunchPadConfigWebMessage
    }

    start(): void {
        this.state = LaunchPadComputerState.Startup
    }

    abort(): void {
        this.state = LaunchPadComputerState.AbortByUser
    }

    sendConfig(): void {
        this.launchPad.sendToControlCenter(this.config)
    }

    updateConfig(config: LaunchPadConfigWebMessage): void {
        this.config = config
    }

    sendStatus(): void {
        const elapsed: number = Date.now() - this.statusTimer
        if (elapsed < 500) {
            return
        }
        this.statusTimer = Date.now()

        const hasSignal: boolean = this.hasRocketSignal()
        const connected: boolean = this.launchPad.isRocketConnected()
        const message: LaunchPadStatusWebMessage = {
            error: false,
            state: this.state,
            pressure: this.pressure,
            connected: connected && hasSignal,
            voltage: 11.2 + Math.random() / 10.0,
            type: WebMessageType.LaunchPadStatus,
        }
        this.launchPad.sendToControlCenter(message)
    }

    hasRocketSignal(): boolean {
        const lastRocketElapsed: number = Date.now() - this.lastRocketSignal
        return lastRocketElapsed < this.config.rocketSignalElapsedThreshold
    }

    onRocketStatus(message: RocketStatusWebMessage): void {
        this.lastRocketSignal = Date.now()
        this.lastRocketState = message.state
    }

    update(): void {
        // send the status
        this.sendStatus()

        this.updateLaunchComputer()
        this.simulatePressurising()

        setTimeout(() => {
            this.update()
        }, this.updateRate)
    }

    private updateLaunchComputer(): void {
        switch (this.state) {
            case LaunchPadComputerState.Locked:
                return this.locked()
            case LaunchPadComputerState.Startup:
                return this.startup()
            case LaunchPadComputerState.WaitForRocket:
                return this.waitForRocket()
            case LaunchPadComputerState.Pressurising:
                return this.pressurising()
            case LaunchPadComputerState.WaitForPressure:
                return this.waitForPressure()
            case LaunchPadComputerState.WaitTankChill:
                return this.waitTankChill()
            case LaunchPadComputerState.RocketStartup:
                return this.rocketStartup()
            case LaunchPadComputerState.WaitRocketStartup:
                return this.waitRocketStartup()
            case LaunchPadComputerState.Countdown:
                return this.countdown()
            case LaunchPadComputerState.Launch:
                return this.launch()
            case LaunchPadComputerState.WaitForLiftOff:
                return this.waitForLiftOff()
            // Abort
            case LaunchPadComputerState.AbortByUser:
                return this.abortByUser()
            case LaunchPadComputerState.AbortAfterLaunch:
                return this.abortAfterLaunch()
            case LaunchPadComputerState.AbortRocketError:
                return this.abortRocketError()
            case LaunchPadComputerState.AbortConnectionLost:
                return this.abortConnectionLost()
            case LaunchPadComputerState.AbortPressurisingTimeout:
                return this.abortPressurisingTimeout()
            case LaunchPadComputerState.AbortRocketStartupTimeout:
                return this.abortRocketStartupTimeout()
        }

    }

    private locked(): void {
        this.timer = Date.now()
        this.enablePressurising = false
    }

    private startup(): void {
        const elapsed: number = Date.now() - this.timer
        if (elapsed < this.config.startupTimeout) {
            return
        }

        this.timer = Date.now()

        this.lastRocketState = 0
        this.lastRocketSignal = 0

        this.changeState(LaunchPadComputerState.WaitForRocket)
    }

    private waitForRocket(): void {
        const elapsed: number = Date.now() - this.timer
        if (elapsed > this.config.rocketConnectingTimeout) {
            this.changeState(LaunchPadComputerState.AbortConnectionLost)
            return
        }

        if (this.lastRocketState !== this.config.rocketConnectedState) {
            return
        }

        const hasRocketSignal: boolean = this.hasRocketSignal()
        if (!hasRocketSignal) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.Pressurising)
    }

    private pressurising(): void {
        const ok: boolean = this.verifyRocketConnected()
        if (!ok) {
            return
        }

        this.enablePressurising = true

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.WaitForPressure)
    }

    private waitForPressure(): void {
        const ok: boolean = this.verifyRocketConnected()
        if (!ok) {
            return
        }

        const elapsed: number = Date.now() - this.timer
        if (elapsed > this.config.pressurisingTimeout) {
            this.changeState(LaunchPadComputerState.AbortPressurisingTimeout)
            return
        }

        if (this.pressure < this.config.targetPressure) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.WaitTankChill)
    }

    private waitTankChill(): void {
        const ok: boolean = this.verifyPressureAndRocketConnected()
        if (!ok) {
            return
        }

        const elapsed: number = Date.now() - this.timer
        if (elapsed < this.config.tankChillDuration) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.RocketStartup)
    }

    private rocketStartup(): void {
        const ok: boolean = this.verifyPressureAndRocketConnected()
        if (!ok) {
            return
        }

        const message: WebMessage = {
            type: WebMessageType.RocketUnlock
        }
        this.launchPad.sendToRocket(message)

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.WaitRocketStartup)

    }

    private waitRocketStartup(): void {
        const ok: boolean = this.verifyPressureAndRocketConnected()
        if (!ok) {
            return
        }

        const elapsed: number = Date.now() - this.timer
        if (elapsed > this.config.rocketStartupTimeout) {
            this.changeState(LaunchPadComputerState.AbortRocketStartupTimeout)
            return
        }

        if (this.lastRocketState !== this.config.rocketStartupState) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.Countdown)
    }

    private countdown(): void {
        const ok: boolean = this.verifyPressureAndRocketConnected()
        if (!ok) {
            return
        }

        const elapsed: number = Date.now() - this.timer
        if (elapsed < 10000/* TODO */) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.Launch)
    }

    private launch(): void {
        const elapsed: number = Date.now() - this.timer
        if (elapsed < this.config.launchValveOpenedDuration) {
            return
        }

        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.WaitForLiftOff)
    }

    private waitForLiftOff(): void {
        this.timer = Date.now()
        this.changeState(LaunchPadComputerState.AbortAfterLaunch)
    }

    private abortByUser(): void {

    }

    private abortAfterLaunch(): void {

    }

    private abortRocketError(): void {

    }

    private abortConnectionLost(): void {

    }

    private abortPressurisingTimeout(): void {

    }

    private abortRocketStartupTimeout(): void {

    }

    private changeState(state: LaunchPadComputerState): void {
        console.log(`change launch computer state from [ ${this.state} ] to [ ${state} ]`)
        this.state = state
    }

    private verifyRocketConnected(): boolean {
        const hasSignal: boolean = this.hasRocketSignal()
        const connected: boolean = this.launchPad.isRocketConnected()
        if (hasSignal && connected) {
            return true
        }

        this.changeState(LaunchPadComputerState.AbortConnectionLost)

        return false
    }

    private verifyPressureAndRocketConnected(): boolean {
        const ok: boolean = this.verifyRocketConnected()
        if (!ok) {
            return false
        }

        if (this.pressure > (this.config.targetPressure - this.config.pressureDropLimit)) {
            return true
        }

        this.changeState(LaunchPadComputerState.AbortPressurisingTimeout)

        return false
    }

    private simulatePressurising(): void {
        if (!this.enablePressurising) {
            return
        }

        const error: number = this.config.targetPressure - this.pressure
        const sign: number = Math.sign(error)
        this.pressure += sign * (Math.random() * 0.5)
    }

}

class LaunchPad {

    private connectionId: number
    private rockets: Map<number, WebSocket>
    private controlCenters: Map<number, WebSocket>

    private launchComputer: LaunchComputer
    private webSocketServer: WebSocketServer | undefined

    constructor() {
        this.connectionId = 0
        this.rockets = new Map<number, WebSocket>()
        this.controlCenters = new Map<number, WebSocket>()
        this.launchComputer = new LaunchComputer(this)
    }

    init(): void {
        const opts: ServerOptions = {
            port: 8080,
            path: '/api/ws',
        }

        this.webSocketServer = new WebSocketServer(opts)
        this.webSocketServer.on("connection", (webSocket: WebSocket, request: IncomingMessage) => {
            this.onConnected(webSocket, request)
        })

        console.log(`web-socket server started on [ ${opts.host}:${opts.port}${opts.path} ]`)
        // start the update loop of the flight computer
        this.launchComputer.update()
    }

    private onConnected(webSocket: WebSocket, request: IncomingMessage): void {
        const id: number = this.connectionId++
        const remoteAddress: string | undefined = request.socket.remoteAddress

        console.log(`web-socket [ ${id} ] from [ ${remoteAddress} ] connected`)

        webSocket.on('error', console.error)

        webSocket.on("close", () => {
            this.onClose(id, webSocket)
        })

        webSocket.on("message", (data: Buffer, isBinary: boolean) => {
            this.onMessage(id, webSocket, data, isBinary)
        })
    }

    private onClose(id: number, webSocket: WebSocket): void {
        console.log(`web-socket [ ${id} ] disconnected`)

        // remove from rockets or control centers
        const wasRocket: boolean = this.rockets.delete(id)
        if (wasRocket) {
            console.log(`rocket web-scoket [ ${id} ] as disconnected`)
        }

        const wasControlCenter = this.controlCenters.delete(id)
        if (wasControlCenter) {
            console.log(`control-center web-scoket [ ${id} ] as disconnected`)
        }
    }

    private toArrayBuffer(buffer: Buffer): ArrayBuffer {
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }

    private onMessage(id: number, webSocket: WebSocket, buf: Buffer, isBinary: boolean): void {
        if (!isBinary) {
            console.error(`received on web-socket [ ${id} ] non binary message [ ${buf} ]`)
            return
        }
        const data: ArrayBuffer = this.toArrayBuffer(buf)
        // decode the messafe
        const message: WebMessage = WebMessageDecoder.decode(data)
        this.dispatch(id, webSocket, message)
    }

    private dispatch(id: number, webSocket: WebSocket, message: WebMessage): void {
        switch (message.type) {
            // Hello
            case WebMessageType.HelloRocket:
                return this.onHelloRocket(id, webSocket)
            case WebMessageType.HelloControlCenter:
                return this.onHelloControlCenter(id, webSocket)

            // LaunchPad
            case WebMessageType.LaunchPadAbort:
                return this.onLaunchPadAbort()
            case WebMessageType.LaunchPadStart:
                return this.onLaunchPadStart()
            case WebMessageType.ReuqestLaunchPadConfig:
                return this.onLaunchPadRequestConfig()
            case WebMessageType.LaunchPadConfig:
                return this.onLaunchPadConfig(message as LaunchPadConfigWebMessage)

            // Rocket
            case WebMessageType.RocketOpenParachute:
                return this.sendToRocket(message)
            case WebMessageType.RocketCloseParachute:
                return this.sendToRocket(message)
            case WebMessageType.RocketStatus:
                return this.onRocketStatus(message as RocketStatusWebMessage)
            case WebMessageType.RocketTelemetry:
                return this.sendToControlCenter(message)
            case WebMessageType.RocketConfig:
                return this.onRocketConfig(id, message as RocketConfigWebMessage)
            case WebMessageType.ReuqestRocketConfig:
                return this.sendToRocket(message)
        }
    }

    private onHelloRocket(id: number, webSocket: WebSocket): void {
        this.rockets.set(id, webSocket)

        console.log(`rocket web-socket [ ${id} ] as connected`)
    }

    private onHelloControlCenter(id: number, webSocket: WebSocket): void {
        this.controlCenters.set(id, webSocket)

        console.log(`control-center web-socket [ ${id} ] as connected`)
    }

    private onLaunchPadAbort(): void {
        this.launchComputer.abort()
    }

    private onLaunchPadStart(): void {
        this.launchComputer.start()
    }

    private onLaunchPadRequestConfig(): void {
        this.launchComputer.sendConfig()
    }

    private onLaunchPadConfig(message: LaunchPadConfigWebMessage): void {
        this.launchComputer.updateConfig(message)
    }

    private onRocketStatus(message: RocketStatusWebMessage): void {
        this.sendToControlCenter(message)
        this.launchComputer.onRocketStatus(message)
    }

    private onRocketConfig(id: number, message: RocketConfigWebMessage): void {
        if (this.rockets.has(id)) {
            this.sendToControlCenter(message)
        }

        if (this.controlCenters.has(id)) {
            this.sendToRocket(message)
        }
    }

    sendToRocket(message: WebMessage): void {
        this.sendTo(this.rockets, message)
    }

    sendToControlCenter(message: WebMessage): void {
        this.sendTo(this.controlCenters, message)
    }

    isRocketConnected(): boolean {
        return this.rockets.size > 0
    }

    private sendTo(map: Map<number, WebSocket>, message: WebMessage): void {
        const data: ArrayBuffer = WebMessageEncoder.encode(message)
        map.forEach((webSocket: WebSocket) => {
            webSocket.send(data)
        })
    }
}

const launchPad: LaunchPad = new LaunchPad()
launchPad.init()