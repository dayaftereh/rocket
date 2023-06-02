import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { WebSocketService } from "../web-socket/websocket.service";
import { WebMessage } from "./web-message";
import { WebMessageDecoder } from "./web-message-decoder";
import { WebMessageEncoder } from "./web-message-encoder";

@Injectable()
export class WebMessageService {

    messages$!: Observable<WebMessage>

    constructor(
        private readonly webSocketService: WebSocketService
    ) {
        this.register()
    }

    private register(): void {
        this.messages$ = this.webSocketService.messageAsObservable().pipe(
            map((buf: ArrayBuffer) => {
                const message: WebMessage = this.decode(buf)
                return message
            })
        )
    }

    private decode(buf: ArrayBuffer): WebMessage {
        const message: WebMessage = WebMessageDecoder.decode(buf)
        return message
    }

    private encode(message: WebMessage): ArrayBuffer {
        const buf: ArrayBuffer = WebMessageEncoder.encode(message)
        return buf
    }

    send(message: WebMessage): void {
        const data: ArrayBuffer = this.encode(message)
        this.webSocketService.write(data)
    }

}