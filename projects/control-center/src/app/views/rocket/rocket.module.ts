import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { PanelModule } from "primeng/panel";
import { RocketComponent } from "./rocket.component";
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
        WebConnectionModule,
        // Custom
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