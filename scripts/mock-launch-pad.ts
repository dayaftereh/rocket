import { IncomingMessage } from 'http';
import { LaunchPadConfigWebMessage, LaunchPadStatusWebMessage, RocketConfigWebMessage, RocketStatusWebMessage, WebMessage, WebMessageDecoder, WebMessageEncoder, WebMessageType } from 'lrocket/services/web/messages/public-api';
import { ServerOptions, WebSocket, WebSocketServer } from 'ws';

class FlightComputer {

    private updateRate: number = 1000

    private state: number = 0
    private pressure: number = 0

    private lastRocketSignal: number = Date.now()

    private config: LaunchPadConfigWebMessage

    constructor(private readonly launchPad: LaunchPad) {
        this.config = {} as LaunchPadConfigWebMessage
    }

    start(): void {

    }

    abort(): void {

    }

    sendConfig(): void {
        this.launchPad.sendToControlCenter(this.config)
    }

    updateConfig(config: LaunchPadConfigWebMessage): void {
        this.config = config
    }

    sendStatus(): void {
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
    }

    update(): void {
        // send the status
        this.sendStatus()

        setTimeout(() => {
            this.update()
        }, this.updateRate)
    }

}

class LaunchPad {

    private connectionId: number
    private rockets: Map<number, WebSocket>
    private controlCenters: Map<number, WebSocket>

    private flightComputer: FlightComputer
    private webSocketServer: WebSocketServer | undefined

    constructor() {
        this.connectionId = 0
        this.rockets = new Map<number, WebSocket>()
        this.controlCenters = new Map<number, WebSocket>()
        this.flightComputer = new FlightComputer(this)
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
        this.flightComputer.update()
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
        this.flightComputer.abort()
    }

    private onLaunchPadStart(): void {
        this.flightComputer.start()
    }

    private onLaunchPadRequestConfig(): void {
        this.flightComputer.sendConfig()
    }

    private onLaunchPadConfig(message: LaunchPadConfigWebMessage): void {
        this.flightComputer.updateConfig(message)
    }

    private onRocketStatus(message: RocketStatusWebMessage): void {
        this.sendToControlCenter(message)
        this.flightComputer.onRocketStatus(message)
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