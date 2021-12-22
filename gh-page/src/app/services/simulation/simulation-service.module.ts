import { NgModule } from "@angular/core";
import { SingleSimulationServiceModule } from "./single/single-simulation-service.module";


@NgModule({
    imports: [
        // custom
        SingleSimulationServiceModule
    ],

})
export class SimulationServiceModule {

}