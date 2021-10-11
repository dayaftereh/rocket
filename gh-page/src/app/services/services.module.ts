import { NgModule } from "@angular/core";
import { ConstantsServiceModule } from "./constants/constants-service.module";
import { LocalStorageServiceModule } from "./local-storage/local-storage-service.module";
import { SimulationServiceModule } from "./simulation/simulation-service.module";

@NgModule({
    imports: [
        // custom
        ConstantsServiceModule,
        SimulationServiceModule,
        LocalStorageServiceModule
    ]
})
export class ServicesModule {

}