import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { UtilitiesComponent } from "./utilities.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
    ],
    declarations: [
        UtilitiesComponent
    ],
    exports: [
        UtilitiesComponent
    ]
})
export class UtilitiesModule {

}