import { Injectable, NgZone } from "@angular/core";
import { Observable, filter, map } from "rxjs";
import { URLService } from "../../url/url.service";
import { WebMessage } from "../messages/web-message";
import { WebMessageType } from "../messages/web-message-type";
import { WebMessageSocket } from "./web-message-socket";

@Injectable()
export class WebRocketConnectionService {

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
        this.push(WebMessageType.HelloRocket)
    }

    send(message: WebMessage): void {
        this.socket.send(message)
    }

    start(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketStart
            }),
            map(() => {
                return undefined
            })
        )
    }

    abort(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketAbort
            }),
            map(() => {
                return undefined
            })
        )
    }

    unlock(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketUnlock
            }),
            map(() => {
                return undefined
            })
        )
    }

    openParachute(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketOpenParachute
            }),
            map(() => {
                return undefined
            })
        )
    }

    closeParachute(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.RocketCloseParachute
            }),
            map(() => {
                return undefined
            })
        )
    }

    requestConfig(): Observable<void> {
        return this.socket.messageAsObservable().pipe(
            filter((message: WebMessage) => {
                return message.type === WebMessageType.ReuqestRocketConfig
            }),
            map(() => {
                return undefined
            })
        )
    }

    messageAsObservable(): Observable<WebMessage> {
        return this.socket.messageAsObservable()
    }

    async disconnect(): Promise<void> {
        await this.socket.disconnect()
    }
}