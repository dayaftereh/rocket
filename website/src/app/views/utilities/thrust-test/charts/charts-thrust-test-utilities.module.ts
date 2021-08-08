import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { ChartsThrustTestUtilitiesComponent } from "./charts-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        // Primeng
        CardModule,
        ChartModule,
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