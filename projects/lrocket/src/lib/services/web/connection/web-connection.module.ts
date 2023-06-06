import { NgModule } from "@angular/core";
import { URLServiceModule } from "../../url/url-service.module";
import { WebControlCenterConnectionService } from "./web-control-center-connection.service";
import { WebRocketConnectionService } from "./web-rocket-connection.service";

@NgModule({
    imports: [
        URLServiceModule,
    ],
    providers: [
        WebRocketConnectionService,
        WebControlCenterConnectionService,
    ],
})
export class WebConnectionModule {

}