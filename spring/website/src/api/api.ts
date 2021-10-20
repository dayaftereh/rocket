import { map, Observable, share, Subject } from "rxjs"
import { Config } from "./config"
import { Message } from "./message"
import { MessageDecoder } from "./message-decoder"
import { Result } from "./result"
import { Valve } from "./valve"

export class API {

    private retry: number
    private subject: Subject<ArrayBuffer>

    private sock: WebSocket | undefined
    private decoder: MessageDecoder

    constructor() {
        this.retry = 0
        this.decoder = new MessageDecoder()
        this.subject = new Subject<ArrayBuffer>()
    }

    async init(): Promise<void> {
        await this.connect()
    }

    private getRoot(): URL {
        const url: URL = new URL(window.location.toString())
        return url
    }

    private join(...paths: string[]): string {
        return paths.join('/').replace(/\/{2,}/, '/')
    }

    private getApiPath(path: string): string {
        const root: URL = this.getRoot()
        root.pathname = this.join('api', path)
        return root.toString()
    }

    private getWebSocketRoot(): URL {
        const root: URL = this.getRoot()

        const protocol: string = root.protocol

        if (protocol.startsWith("https")) {
            root.protocol = "wss:"
        } else {
            root.protocol = "ws:"
        }

        return root
    }

    private getWebSocketPath(): string {
        const root: URL = this.getWebSocketRoot()
        root.pathname = this.join('api', "ws")
        return root.toString()
    }

    private async connect(): Promise<void> {

        let completed: boolean = false
        const url: string = this.getWebSocketPath()

        this.sock = new WebSocket(url)
        this.sock.binaryType = 'arraybuffer';

        return new Promise<void>((resolve, reject) => {

            this.sock.onopen = () => {
                this.retry = 0
                if (completed) {
                    return
                }
                completed = true
                resolve()
            }

            this.sock.onmessage = (event: MessageEvent<ArrayBuffer>) => {
                this.onMessage(event)
            }

            this.sock.onerror = (err) => {
                if (completed) {
                    this.subject.error(err)
                    return
                }
                completed = true

                const e: Error = new Error(`WebSocket got an error`)
                e.name = 'WebSocket'
                reject(e)
            }

            this.sock.onclose = (event: CloseEvent) => {
                const e: Error = new Error(`Websocket closed, because [ ${event.code} ]`)
                e.name = 'WebSocket'
                this.triggerReconnect()
            }
        })
    }

    private async triggerReconnect(): Promise<void> {
        this.retry++
        const timeout: number = Math.min(this.retry, 30) * 2000 // 1 - 60 s
        await this.wait(timeout)
        await this.connect()
    }

    private wait(timeout: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    }

    private onMessage(event: MessageEvent<ArrayBuffer>): void {
        const data: ArrayBuffer = event.data
        this.subject.next(data)
    }

    asObservable(): Observable<Message> {

        return this.subject.pipe(
            share(),
            map((data: ArrayBuffer) => {
                const message: Message = this.decoder.decode(data)
                return message
            })
        )
    }

    private async post<T, R>(url: string, body: T): Promise<R> {
        const content: string = JSON.stringify(body)

        const response: Response = await fetch(url, {
            body: content,
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual',
            referrerPolicy: 'no-referrer'
        })

        const result: R = await response.json()
        return result
    }

    private async get<T>(url: string): Promise<T> {
        const response: Response = await fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            redirect: 'manual',
            referrerPolicy: 'no-referrer'
        })

        const result: T = await response.json()
        return result
    }

    async getConfig(): Promise<Config> {
        const url: string = this.getApiPath('config')
        const config: Config = await this.get(url)
        return config
    }

    async setConfig(config: Config): Promise<Result> {
        const url: string = this.getApiPath('config')
        const result: Result = await this.post(url, config)
        return result
    }

    async valve(valve: Valve): Promise<Result> {
        const url: string = this.getApiPath('valve')
        const result: Result = await this.post(url, valve)
        return result
    }

}