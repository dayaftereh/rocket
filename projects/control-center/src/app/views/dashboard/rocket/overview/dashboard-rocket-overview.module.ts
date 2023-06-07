import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { DashboardRocketOverviewComponent } from "./dashboard-rocket-overview.component";

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
        DashboardRocketOverviewComponent
    ],
    exports: [
        DashboardRocketOverviewComponent
    ]
})
export class DashboardRocketOverviewModule {

}