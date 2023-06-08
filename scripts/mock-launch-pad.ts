import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { WebMessage, WebMessageDecoder } from 'lrocket';

const clients: WebSocket[] = []
const wss: WebSocketServer = new WebSocketServer({ port: 8080, path: '/api/ws' });

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