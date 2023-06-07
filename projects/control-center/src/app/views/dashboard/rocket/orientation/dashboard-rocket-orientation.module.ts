import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { DashboardRocketOrientationComponent } from "./dashboard-rocket-orientation.component";

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
        DashboardRocketOrientationComponent
    ],
    exports: [
        DashboardRocketOrientationComponent
    ]
})
export class DashboardRocketOrientationModule {

}