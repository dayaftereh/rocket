import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { DashboardControlComponent } from "./dashboard-control.component";

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
        DashboardControlComponent
    ],
    exports: [
        DashboardControlComponent
    ]
})
export class DashboardControlModule {

}