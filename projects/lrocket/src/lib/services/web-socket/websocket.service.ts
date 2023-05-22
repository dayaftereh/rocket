import { Injectable, NgZone } from "@angular/core";
import { URLService } from "lrocket";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable()
export class WebSocketService {

    private sock: WebSocket | undefined
    private connecting: Promise<void> | undefined

    private retry: BehaviorSubject<number>
    private connected: BehaviorSubject<boolean>
    private messages: Subject<ArrayBuffer>

    constructor(
        private readonly ngZone: NgZone,
        private readonly urlService: URLService,
    ) {
        this.messages = new Subject<ArrayBuffer>()
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
                    this.messages.error(err)

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
                        this.messages.error(e)
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

    async write(data: ArrayBuffer): Promise<void> {
        // wait for connected
        await this.connecting
        // check if socket open
        if (!this.sock || this.sock.readyState !== this.sock.OPEN) {
            throw new Error("websocket undefined or not connected")
        }
        // send the data
        this.sock.send(data)
    }

    private onMessage(event: MessageEvent<ArrayBuffer>): void {
        const data: ArrayBuffer = event.data
        this.messages.next(data)
    }

    messageAsObservable(): Observable<ArrayBuffer> {
        return this.messages
    }

    connectedAsObservable(): Observable<boolean> {
        return this.connected
    }

    retriesAsObservable(): Observable<number> {
        return this.retry
    }

}