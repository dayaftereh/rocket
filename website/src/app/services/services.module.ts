import { NgModule } from "@angular/core";
import { GlobalsServiceModule } from "./globals/globals-service.module";
import { LocalStorageServiceModule } from "./local-storage/local-storage-service.module";
import { SerialServiceModule } from "./serial/serial-service.module";

@NgModule({
    imports: [
        // custom
        SerialServiceModule,
        GlobalsServiceModule,
        LocalStorageServiceModule
    ]
})
export class ServicesModule {

}