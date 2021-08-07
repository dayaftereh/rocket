import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ChartsThrustTestUtilitiesComponent } from "./charts-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule
    ],
    declarations: [
        ChartsThrustTestUtilitiesComponent
    ],
    exports: [
        ChartsThrustTestUtilitiesComponent
    ]
})
export class ChartsThrustTestUtilitiesModule {

}