import { NgModule } from "@angular/core";
import { ConstantsServiceModule } from "../../constants/constants-service.module";
import { LocalStorageServiceModule } from "../../local-storage/local-storage-service.module";
import { MultipleSimulationService } from "./multiple-simulation.service";

@NgModule({
    imports: [
        // custom
        ConstantsServiceModule,
        LocalStorageServiceModule
    ],
    providers: [
        MultipleSimulationService
    ]
})
export class MultipleSimulationServiceModule {

}