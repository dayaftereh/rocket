import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { ChartModule } from 'primeng/chart';
import { ChartsSimulationUtilitiesComponent } from "./charts-simulation-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        // Primeng
        CardModule,
        ChartModule,
    ],
    declarations: [
        ChartsSimulationUtilitiesComponent
    ],
    exports: [
        ChartsSimulationUtilitiesComponent
    ]
})
export class ChartsSimulationUtilitiesModule {

}