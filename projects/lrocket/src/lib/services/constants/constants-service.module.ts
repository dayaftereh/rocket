import { NgModule } from "@angular/core";
import { LocalStorageServiceModule } from "../local-storage/local-storage-service.module";
import { ConstantsService } from "./constants.service";

@NgModule({
    imports: [
        // CUstom
        LocalStorageServiceModule
    ],
    providers: [
        ConstantsService
    ]
})
export class ConstantsServiceModule {

}