import { NgModule } from "@angular/core";
import { LocalStorageServiceModule, WebConnectionModule } from "lrocket";
import { RocketService } from "./rocket.service";

@NgModule({
    imports: [
        // lrocket
        WebConnectionModule,
        LocalStorageServiceModule,
    ],
    providers: [
        RocketService
    ]
})
export class RocketServiceModule {

}