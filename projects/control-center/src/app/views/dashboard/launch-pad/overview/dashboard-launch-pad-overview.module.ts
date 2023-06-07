import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { DashboardLaunchPadOverviewComponent } from "./dashboard-launch-pad-overview.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        ButtonModule,
        // ngx-translate
        TranslateModule,
        // lrocket
        WebConnectionModule,
        // Custom
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