import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { UtilsConnectedComponent } from "./utils-connected.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
    ],
    declarations: [
        UtilsConnectedComponent
    ],
    exports: [
        UtilsConnectedComponent
    ]
})
export class UtilsConnectedModule {

}