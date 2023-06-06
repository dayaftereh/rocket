import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { DashboardLaunchPadPressureComponent } from "./dashboard-launch-pad-pressure.component";

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