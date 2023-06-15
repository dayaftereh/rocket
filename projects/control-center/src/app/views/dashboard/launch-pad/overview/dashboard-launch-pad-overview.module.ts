import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { LaunchPadLaunchComputerStateModule, UtilsConnectedModule, UtilsErrorModule, WebConnectionModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { TooltipModule } from 'primeng/tooltip';
import { DashboardLaunchPadOverviewComponent } from "./dashboard-launch-pad-overview.component";

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
        WebConnectionModule,
        // Custom
        UtilsErrorModule,
        UtilsConnectedModule,
        LaunchPadLaunchComputerStateModule,
    ],
    declarations: [
        DashboardLaunchPadOverviewComponent
    ],
    exports: [
        DashboardLaunchPadOverviewComponent
    ]
})
export class DashboardLaunchPadOverviewModule {

}