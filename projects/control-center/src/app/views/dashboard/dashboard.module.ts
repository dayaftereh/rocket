import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { DashboardControlModule } from "./control/dashboard-control.module";
import { DashboardComponent } from "./dashboard.component";
import { DashboardLaunchPadModule } from "./launch-pad/dashboard-launch-pad.module";
import { DashboardRocketModule } from "./rocket/dashboard-rocket.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
        // lrocket
        WebConnectionModule,
        // Custom
        DashboardRocketModule,
        DashboardControlModule,
        DashboardLaunchPadModule,
    ],
    declarations: [
        DashboardComponent
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule {


}