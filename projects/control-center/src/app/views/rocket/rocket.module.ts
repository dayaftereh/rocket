import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { PanelModule } from "primeng/panel";
import { RocketServiceModule } from "../../services/rocket/rocket-service.module";
import { RocketComponent } from "./rocket.component";
import { RocketStatusModule } from "./status/rocket-status.module";
import { RocketTelemetryModule } from "./telemetry/rocket-telemetry.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        PanelModule,
        // ngx-translate
        TranslateModule,
        // lrocket        
        // Custom
        RocketStatusModule,
        RocketServiceModule,
        RocketTelemetryModule,
    ],
    declarations: [
        RocketComponent
    ],
    exports: [
        RocketComponent
    ]
})
export class RocketModule {

}