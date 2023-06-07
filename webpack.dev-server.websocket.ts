import { Configuration } from 'webpack';
import { WebSocketServer } from "ws"

export default {
    devServer: {
        setupMiddlewares: (middlewares: any, devServer: any) => {

            //var wss = new WebSocketServer({ server: devServer.app, path: "/api/ws", noServer: true });

            /*wss.on("connection", (webSocket: any) => {
                console.log("###wf#w#f#w#f")

            })*/

            devServer.app.on("upgrade", (request: any, socket: any, head: any) => {
                console.log("-------------------")
            })

            //console.log(wss)

            devServer.app.get("/hello", (_: any, response: any) => {
                response.send("setup-middlewares option GET");
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++-")
            });


            return middlewares
        }
    }

} as Configuration;