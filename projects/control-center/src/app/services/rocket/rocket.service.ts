import { Injectable } from "@angular/core";
import { LocalStorageService, RocketConfigWebMessage, RocketFlightComputerState, RocketStatusWebMessage, RocketTelemetryWebMessage, WebMessageType, WebRocketConnectionService } from "lrocket";
import { BehaviorSubject, Observable, Subject, Subscription, switchMap } from "rxjs";
import { FlightComputer } from "./flight-computer";

@Injectable()
export class RocketService {

    private running: boolean

    private lastUpdate: number | undefined
    private statusTimer: number
    private telemetryTimer: number

    private rocketConfigKey: string = `rocket-config`
    private rocketTelemetryKey: string = `rocket-telemetry`

    private status: Subject<RocketStatusWebMessage>
    private config: BehaviorSubject<RocketConfigWebMessage>
    private telemetry: BehaviorSubject<RocketTelemetryWebMessage>

    private flightComputer: FlightComputer

    private subscriptions: Subscription[]

    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly webRocketConnectionService: WebRocketConnectionService,
    ) {
        this.running = false
        this.statusTimer = 0
        this.subscriptions = []
        this.telemetryTimer = 0
        this.lastUpdate = undefined
        this.flightComputer = new FlightComputer()
        this.status = new Subject<RocketStatusWebMessage>()
        this.config = new BehaviorSubject<RocketConfigWebMessage>(
            this.localStorageService.getObjectOrDefault(this.rocketConfigKey, this.defaultConfig())
        )
        this.telemetry = new BehaviorSubject<RocketTelemetryWebMessage>(
            this.localStorageService.getObjectOrDefault(this.rocketTelemetryKey, this.defaultTelemetry())
        )

        this.register()
    }

    private register(): void {
        const configSubscription: Subscription = this.config.subscribe((config: RocketConfigWebMessage) => {
            this.localStorageService.updateObject(this.rocketConfigKey, config)
        })

        const telemetrySubscription: Subscription = this.telemetry.subscribe((telemetry: RocketTelemetryWebMessage) => {
            this.localStorageService.updateObject(this.rocketTelemetryKey, telemetry)
        })

        const requestConfigSubscription: Subscription = this.webRocketConnectionService.requestConfig().pipe(
            switchMap(() => {
                return this.config
            })
        ).subscribe((config: RocketConfigWebMessage) => {
            this.onRequestConfig(config)
        })

        const statusSubscription: Subscription = this.status.subscribe((status: RocketStatusWebMessage) => {
            this.webRocketConnectionService.send(status)
        })

        const startSubscription: Subscription = this.webRocketConnectionService.start().subscribe(() => {
            this.flightComputer.start()
        })

        const unlockSubscription: Subscription = this.webRocketConnectionService.unlock().subscribe(() => {
            this.flightComputer.unlock()
        })

        const abortSubscription: Subscription = this.webRocketConnectionService.abort().subscribe(() => {
            this.flightComputer.abort()
        })

        this.subscriptions.push(
            configSubscription,
            telemetrySubscription,
            requestConfigSubscription,
            statusSubscription,
            startSubscription,
            unlockSubscription,
            abortSubscription,
        )
    }

    private defaultConfig(): RocketConfigWebMessage {
        return {
            type: WebMessageType.RocketConfig,
            // FlightComputer
            launchAccelerationThreshold: 2.0,
            liftOffVelocityThreshold: 0.25,
            mecoAccelerationThreshold: 0.2,
            apogeeVelocityThreshold: 0.2,
            landedOrientationCount: 1000,
            landedOrientationThreshold: 1.0,
            landedAccelerationThreshold: 0.2,
            landedChangeDetectTimeout: 5000,
            flightTerminateTimeout: 15000,

            // NetworkClient
            ssid: "Laucnh-Pad",
            password: "12345678",

            // ParachuteManager
            parachutePin: 1,
            parachuteChannel: 0,
            parachuteFrequency: 50,
            parachuteOpenDuty: 0,
            parachuteCloseDuty: 1024,

            // Rocket
            statusMessageUpdate: 250,
            telemetryMessageUpdate: 1000 / 10,
        }
    }

    private defaultTelemetry(): RocketTelemetryWebMessage {
        return {
            type: WebMessageType.RocketTelemetry,
            time: 0,
            elapsed: 0,
            voltage: 4.2,
            altitude: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            gyroscopeX: 0,
            gyroscopeY: 0,
            gyroscopeZ: 0,
            accelerationX: 0,
            accelerationY: 0,
            accelerationZ: 9.81,
            magnetometerX: 3,
            magnetometerY: 0,
            magnetometerZ: 0,
        }
    }

    async start(): Promise<void> {
        this.running = true
        // connect the rocket websocket
        await this.webRocketConnectionService.connect()

        // start the update loop
        const time: number = performance.now()
        this.lastUpdate = performance.now()
        this.requestUpdate(time)
    }

    private requestUpdate(start: number): void {
        // check if running
        if (!this.running) {
            return
        }

        const now: number = performance.now()
        if (!this.lastUpdate) {
            this.lastUpdate = now
        }
        const time: number = now - start
        // calculate elapsed
        const elapsed: number = (now - this.lastUpdate) / 1000.0
        this.lastUpdate = now

        // execute update
        this.update(time, elapsed)

        // use timeout for update
        setTimeout(() => {
            this.requestUpdate(start)
        }, 1000.0 / 60.0)
    }

    private update(time: number, elapsed: number): void {
        // emit status and telemetry
        this.emitStatus(elapsed)
        this.emitTelemetry(time, elapsed)

        this.flightComputer.update(time, elapsed)
    }

    private emitStatus(elapsed: number): void {
        // get the config
        const config: RocketConfigWebMessage = this.config.value
        // update the status timer
        this.statusTimer += (elapsed * 1000.0)
        // check if status needs to be emitted
        if (this.statusTimer < config.statusMessageUpdate) {
            return
        }

        // reset the timer
        this.statusTimer = 0

        const state: RocketFlightComputerState = this.flightComputer.getState()

        // create the status
        const message: RocketStatusWebMessage = {
            type: WebMessageType.RocketStatus,
            error: false,
            state: state,
        }

        this.status.next(message)
    }

    private emitTelemetry(time: number, elapsed: number): void {
        // get the config
        const config: RocketConfigWebMessage = this.config.value
        // update the telemetry timer
        this.telemetryTimer += (elapsed * 1000.0)
        // check if status needs to be emitted
        if (this.telemetryTimer < config.telemetryMessageUpdate) {
            return
        }

        // reset the timer
        this.telemetryTimer = 0

        // get the current telemetry
        const telemetry: RocketTelemetryWebMessage = this.telemetry.value
        const message: RocketTelemetryWebMessage = Object.assign({}, telemetry, {
            time,
            elapsed,
        })
        this.webRocketConnectionService.send(message)
    }

    private onRequestConfig(config: RocketConfigWebMessage): void {
        this.webRocketConnectionService.send(config)
    }

    configAsObservable(): Observable<RocketConfigWebMessage> {
        return this.config
    }

    telemetryAsObservable(): Observable<RocketTelemetryWebMessage> {
        return this.telemetry
    }

    statusAsObservable(): Observable<RocketStatusWebMessage> {
        return this.status
    }

    updateTelemetry(telemetry: RocketTelemetryWebMessage): void {
        this.telemetry.next(telemetry)
    }

    async stop(): Promise<void> {
        this.running = false

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })

        this.webRocketConnectionService.disconnect()
    }
}