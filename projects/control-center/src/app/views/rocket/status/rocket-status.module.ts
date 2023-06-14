import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { RocketFlightComputerStateModule, UtilsErrorModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { RocketServiceModule } from "../../../services/rocket/rocket-service.module";
import { RocketStatusComponent } from "./rocket-status.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        ButtonModule,
        TooltipModule,
        // ngx-translate
        TranslateModule,
        // lrocket
        UtilsErrorModule,
        RocketFlightComputerStateModule,
        // Custom
        RocketServiceModule,
    ],
    declarations: [
        RocketStatusComponent
    ],
    exports: [
        RocketStatusComponent
    ]
})
export class RocketStatusModule {

}