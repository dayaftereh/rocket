import { Injectable, NgZone } from "@angular/core";
import { Observable, filter, map } from "rxjs";
import { URLService } from "../../url/url.service";
import { LaunchPadConfigWebMessage } from "../messages/launch-pad-config-web-message";
import { LaunchPadStatusWebMessage } from "../messages/launch-pad-status-web-message";
import { RocketConfigWebMessage } from "../messages/rocket-config-web-message";
import { RocketStatusWebMessage } from "../messages/rocket-status-web-message";
import { RocketTelemetryWebMessage } from "../messages/rocket-telemetry-web-message";
import { WebMessage } from "../messages/web-message";
import { WebMessageType } from "../messages/web-message-type";
import { WebMessageSocket } from "./web-message-socket";

@Injectable()
export class WebControlCenterConnectionService {

    private socket: WebMessageSocket

    constructor(
        ngZone: NgZone,
        urlService: URLService,
    ) {
        this.socket = new WebMessageSocket(ngZone, urlService)

        this.register()
    }

    private register(): void {
        this.socket.connectedAsObservable().pipe(
            filter((connected: boolean) => {
                return connected
            })
        ).subscribe(() => {
            this.onSocketOpen()
        })
    }

    async connect(): Promise<void> {
        await this.socket.connect()
    }

    private onSocketOpen(): void {
        this.sendHello()
    }

    private push(messageType: WebMessageType): void {
        const message: WebMessage = {
            type: messageType
        }
        this.socket.send(message)
    }

    sendHello(): void {
        this.push(WebMessageType.HelloControlCenter)
    }

    openParachute(): void {
        this.push(WebMessageType.RocketOpenParachute)
    }

    closeParachute(): void {
        this.push(WebMessageType.RocketCloseParachute)
    }

    start(): void {
        this.push(WebMessageType.LaunchPadStart)
    }

    abort(): void {
        this.push(WebMessageType.LaunchPadAbort)
    }

    launchPadConfig(): Observable<LaunchPadConfigWebMessage> {
        const observable: Observable<LaunchPadConfigWebMessage> = this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.LaunchPadConfig
            }),
            map((message: WebMessage) => {
                return message as LaunchPadConfigWebMessage
            })
        )

        this.push(WebMessageType.ReuqestLaunchPadConfig)

        return observable
    }

    launchPadStatus(): Observable<LaunchPadStatusWebMessage> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.LaunchPadStatus
            }),
            map((message: WebMessage) => {
                return message as LaunchPadStatusWebMessage
            })
        )
    }

    rocketConfig(): Observable<RocketConfigWebMessage> {
        const observable: Observable<RocketConfigWebMessage> = this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketConfig
            }),
            map((message: WebMessage) => {
                return message as RocketConfigWebMessage
            })
        )

        this.push(WebMessageType.ReuqestLaunchPadConfig)

        return observable
    }

    rocketStatus(): Observable<RocketStatusWebMessage> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketStatus
            }),
            map((message: WebMessage) => {
                return message as RocketStatusWebMessage
            })
        )
    }

    rocketTelemetry(): Observable<RocketTelemetryWebMessage> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketTelemetry
            }),
            map((message: WebMessage) => {
                return message as RocketTelemetryWebMessage
            })
        )
    }

    async disconnect(): Promise<void> {
        await this.socket.disconnect()
    }
}