import { NgModule } from "@angular/core";
import { WebSocketServiceModule } from "../web-socket/websocket-service.module";
import { WebMessageService } from "./web-message.service";

@NgModule({
    imports: [
        //lrocket
        WebSocketServiceModule,
    ],
    providers: [
        WebMessageService
    ]
})
export class WebMessageServiceModule {

}