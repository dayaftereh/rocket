import { NgModule } from "@angular/core";
import { LocalStorageServiceModule } from "../local-storage/local-storage-service.module";
import { SimulationService } from "./simulation.service";

@NgModule({
    imports:[
        // custom
        LocalStorageServiceModule
    ],
    providers: [
        SimulationService
    ]
})
export class SimulationServiceModule {

}