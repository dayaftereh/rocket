import { NgModule } from "@angular/core";
import { LocalStorageServiceModule } from "../local-storage/local-storage-service.module";
import { GlobalsService } from "./globals.service";

@NgModule({
    imports: [
        // CUstom
        LocalStorageServiceModule
    ],
    providers: [
        GlobalsService
    ]
})
export class GlobalsServiceModule {

}