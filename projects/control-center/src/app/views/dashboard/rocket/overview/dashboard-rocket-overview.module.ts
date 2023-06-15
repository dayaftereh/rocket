import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { RocketFlightComputerStateModule, UtilsErrorModule, WebConnectionModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { TooltipModule } from "primeng/tooltip";
import { DashboardRocketOverviewComponent } from "./dashboard-rocket-overview.component";

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
        // lrocket
        UtilsErrorModule,
        WebConnectionModule,
        RocketFlightComputerStateModule,
        // Custom
    ],
    declarations: [
        DashboardRocketOverviewComponent
    ],
    exports: [
        DashboardRocketOverviewComponent
    ]
})
export class DashboardRocketOverviewModule {

}