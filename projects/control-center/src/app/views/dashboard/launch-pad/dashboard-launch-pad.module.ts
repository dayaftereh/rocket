import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { PanelModule } from "primeng/panel";
import { DashboardLaunchPadComponent } from "./dashboard-launch-pad.component";
import { DashboardLaunchPadOverviewModule } from "./overview/dashboard-launch-pad-overview.module";
import { DashboardLaunchPadPressureModule } from "./pressure/dashboard-launch-pad-pressure.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        PanelModule,
        ButtonModule,
        // ngx-translate
        TranslateModule,
        // Custom
        DashboardLaunchPadPressureModule,
        DashboardLaunchPadOverviewModule,
    ],
    declarations: [
        DashboardLaunchPadComponent
    ],
    exports: [
        DashboardLaunchPadComponent
    ]
})
export class DashboardLaunchPadModule {

}