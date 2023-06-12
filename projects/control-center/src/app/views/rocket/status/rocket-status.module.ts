import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { WebConnectionModule } from "lrocket";
import { RocketStatusComponent } from "./rocket-status.component";

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
        RocketStatusComponent
    ],
    exports: [
        RocketStatusComponent
    ]
})
export class RocketStatusModule {

}