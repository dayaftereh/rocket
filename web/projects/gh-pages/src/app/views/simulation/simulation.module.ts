import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { MultipleSimulationModule } from "./multiple/multiple-simulation.module";
import { SimulationComponent } from "./simulation.component";
import { SingleSimulationModule } from "./single/single-simulation.module";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // custom
        SingleSimulationModule,
        MultipleSimulationModule,
    ],
    declarations: [
        SimulationComponent
    ],
    exports: [
        SimulationComponent
    ]
})
export class SimulationModule {

}