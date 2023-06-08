import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { PanelModule } from 'primeng/panel';
import { DashboardRocketControlModule } from "./control/dashboard-rocket-control.module";
import { DashboardRocketComponent } from "./dashboard-rocket.component";
import { DashboardRocketOrientationModule } from "./orientation/dashboard-rocket-orientation.module";
import { DashboardRocketOverviewModule } from "./overview/dashboard-rocket-overview.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        PanelModule,
        // ngx-translate
        TranslateModule,
        // Custom
        DashboardRocketControlModule,
        DashboardRocketOverviewModule,
        DashboardRocketOrientationModule,
    ],
    declarations: [
        DashboardRocketComponent
    ],
    exports: [
        DashboardRocketComponent
    ]
})
export class DashboardRocketModule {

}