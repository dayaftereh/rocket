import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { GlobalsServiceModule } from "../../../../services/globals/globals-service.module";
import { ChartsThrustTestUtilitiesComponent } from "./charts-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        // Primeng
        CardModule,
        ChartModule,
        // Custom
        GlobalsServiceModule
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