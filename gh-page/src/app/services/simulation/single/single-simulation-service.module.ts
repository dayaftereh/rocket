import { NgModule } from "@angular/core";
import { ConstantsServiceModule } from "../../constants/constants-service.module";
import { LocalStorageServiceModule } from "../../local-storage/local-storage-service.module";
import { SingleSimulationService } from "./single-simulation.service";

@NgModule({
    imports: [
        // custom
        ConstantsServiceModule,
        LocalStorageServiceModule
    ],
    providers: [
        SingleSimulationService
    ]
})
export class SingleSimulationServiceModule {

}