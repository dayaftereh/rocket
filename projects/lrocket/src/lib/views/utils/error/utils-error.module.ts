import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { UtilsErrorComponent } from "./utils-error.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
    ],
    declarations: [
        UtilsErrorComponent
    ],
    exports: [
        UtilsErrorComponent
    ]
})
export class UtilsErrorModule{
    
}