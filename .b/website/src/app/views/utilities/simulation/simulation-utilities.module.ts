import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ChartsSimulationUtilitiesModule } from "./charts/charts-simulation-utilities.module";
import { ConfigSimulationUtilitiesModule } from "./config/config-simulation-utilities.module";
import { SimulationUtilitiesComponent } from "./simulation-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        //Custom
        ConfigSimulationUtilitiesModule,
        ChartsSimulationUtilitiesModule
    ],
    declarations: [
        SimulationUtilitiesComponent
    ],
    exports: [
        SimulationUtilitiesComponent
    ]
})
export class SimulationUtilitiesModule {

}