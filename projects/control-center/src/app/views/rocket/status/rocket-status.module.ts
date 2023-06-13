import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { RocketServiceModule } from "../../../services/rocket/rocket-service.module";
import { RocketStatusComponent } from "./rocket-status.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        // ngx-translate
        TranslateModule,
        // Custom
        RocketServiceModule,
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