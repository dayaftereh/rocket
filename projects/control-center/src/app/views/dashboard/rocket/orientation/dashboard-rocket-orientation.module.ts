import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DashboardRocketOrientationComponent } from "./dashboard-rocket-orientation.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
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