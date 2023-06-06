import { NgZone } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { URLService } from "../../url/url.service";
import { WebMessage } from "../messages/web-message";
import { WebMessageDecoder } from "../messages/web-message-decoder";
import { WebMessageEncoder } from "../messages/web-message-encoder";

export class WebMessageSocket {

    private sock: WebSocket | undefined
    private connecting: Promise<void> | undefined

    private errors: Subject<Error>
    private messages: Subject<WebMessage>

    private retry: BehaviorSubject<number>
    private connected: BehaviorSubject<boolean>

    constructor(
        private readonly ngZone: NgZone,
        private readonly urlService: URLService,
    ) {
        this.errors = new Subject<Error>()
        this.messages = new Subject<WebMessage>()
        this.retry = new BehaviorSubject<number>(0)
        this.connected = new BehaviorSubject<boolean>(true)
    }

    async connect(): Promise<void> {
        await this.runConnect()
    }

    private runConnect(): Promise<void> {
        let completed: boolean = false
        const url: string = this.urlService.getWebSocketPath()

        // set the connecting promise
        this.connecting = new Promise<void>((resolve, reject) => {
            this.ngZone.runOutsideAngular(() => {

                this.sock = new WebSocket(url)
                this.sock.binaryType = 'arraybuffer';

                this.sock.onopen = () => {
                    if (!completed) {
                        resolve()
                    }
                    completed = true
                    this.onOpen()
                }

                this.sock.onmessage = (event: MessageEvent<ArrayBuffer>) => {
                    this.onMessage(event)
                }

                this.sock.onerror = (err) => {
                    const e: Error = new Error(`WebSocket got an error ${err}`)
                    e.name = 'WebSocket'
                    this.errors.next(e)

                    if (completed) {
                        return
                    }
                    completed = true

                    reject(e)
                }

                this.sock.onclose = (event: CloseEvent) => {
                    const e: Error = new Error(`Websocket closed, because [ ${event.code} ]`)
                    e.name = 'WebSocket'

                    if (!completed) {
                        reject(e)
                    } else {
                        completed = true
                    }

                    this.onClose()
                }
            })
        })

        return this.connecting
    }

    private onOpen(): void {
        this.retry.next(0)
        this.connected.next(true)
    }

    private onClose(): void {
        this.triggerReconnect()
    }

    private wait(timeout: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    }

    private async triggerReconnect(): Promise<void> {
        const retry: number = this.retry.value
        this.retry.next(retry + 1)
        this.connected.next(false)

        const timeout: number = (1 + Math.min(retry, 60.0)) * 1000.0 // 1 - 60 s

        await this.wait(timeout)
        await this.connect()
    }

    async send(message: WebMessage): Promise<void> {
        // wait for connected
        await this.connecting
        // check if socket open
        if (!this.sock || this.sock.readyState !== this.sock.OPEN) {
            throw new Error("websocket undefined or not connected")
        }

        const data: ArrayBuffer = WebMessageEncoder.encode(message)
        this.sock.send(data)
    }

    async disconnect(): Promise<void> {
        // wait for connected
        await this.connecting
        // check if socket open
        if (!this.sock || this.sock.readyState !== this.sock.OPEN) {
            return
        }

        this.sock.close()
    }

    private onMessage(event: MessageEvent<ArrayBuffer>): void {
        const data: ArrayBuffer = event.data
        const message: WebMessage = WebMessageDecoder.decode(data)
        this.messages.next(message)
    }

    messageAsObservable(): Observable<WebMessage> {
        return this.messages
    }

    connectedAsObservable(): Observable<boolean> {
        return this.connected
    }

    retriesAsObservable(): Observable<number> {
        return this.retry
    }

    errorsAsObservable(): Observable<Error> {
        return this.errors
    }

}