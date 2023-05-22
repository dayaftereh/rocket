import { NgModule, NgZone } from "@angular/core"
import { URLService, URLServiceModule } from "lrocket"
import { WebSocketService } from "./websocket.service"

@NgModule({
    imports: [
        // Custom
        URLServiceModule
    ],
    providers: [
        {
            provide: WebSocketService,
            useFactory: async (ngZone: NgZone, urlService: URLService) => {
                const webSocketService: WebSocketService = new WebSocketService(ngZone, urlService)
                await webSocketService.connect()
                return webSocketService
            },
            deps: [
                NgZone,
                URLService
            ]
        }
    ]
})
export class WebSocketServiceModule {

}