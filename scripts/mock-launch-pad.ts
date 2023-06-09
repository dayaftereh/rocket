import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { WebMessageDecoder, WebMessage } from 'lrocket/services/web/messages/public-api'


class LaunchPad {

    private connectionId: number
    private rockets: Map<number, WebSocket>
    private controlCenters: Map<number, WebSocket>

    private webSocketServer: WebSocketServer | undefined

    constructor() {
        this.connectionId = 0
        this.rockets = new Map<number, WebSocket>()
        this.controlCenters = new Map<number, WebSocket>()
    }

    init(): void {
        this.webSocketServer = new WebSocketServer({ port: 8080, path: '/api/ws' })
        this.webSocketServer.on("connection", (webSocket: WebSocket, request: IncomingMessage) => {

        })
    }

    private onConnected(webSocket: WebSocket, request: IncomingMessage): void {
        const id: number = this.connectionId++
    }

    private onClose(id: number, webSocket: WebSocket): void {

    }

    private onMessage(id: number, webSocket: WebSocket): void {

    }

}

const clients: WebSocket[] = []
const wss: WebSocketServer

console.log(WebMessageDecoder.decode)

wss.on('connection', function connection(webSocket: WebSocket, request: IncomingMessage) {
    clients.push(webSocket)

    webSocket.on("close", () => {
        const index: number = clients.indexOf(webSocket)
        if (index > -1) {
            clients.slice(index, 1)
        }
    })

    webSocket.on('error', console.error);

    webSocket.on("message", (data: ArrayBuffer, isBinary: boolean) => {
        const message: WebMessage = WebMessageDecoder.decode(data)
        console.log(message)
    })

});

console.log("started")