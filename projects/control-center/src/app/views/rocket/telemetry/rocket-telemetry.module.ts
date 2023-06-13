import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { TooltipModule } from "primeng/tooltip";
import { RocketServiceModule } from "../../../services/rocket/rocket-service.module";
import { RocketTelemetryComponent } from "./rocket-telemetry.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        ButtonModule,
        TooltipModule,
        InputNumberModule,
        // ngx-translate
        TranslateModule,
        // Custom
        RocketServiceModule,
    ],
    declarations: [
        RocketTelemetryComponent
    ],
    exports: [
        RocketTelemetryComponent
    ]
})
export class RocketTelemetryModule {

}