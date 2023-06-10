import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { LRocketChartModule, WebConnectionModule } from "lrocket";
import { DashboardLaunchPadPressureComponent } from "./dashboard-launch-pad-pressure.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
        // lrocket
        LRocketChartModule,
        WebConnectionModule,
        // Custom
    ],
    declarations: [
        DashboardLaunchPadPressureComponent
    ],
    exports: [
        DashboardLaunchPadPressureComponent
    ]
})
export class DashboardLaunchPadPressureModule {

}