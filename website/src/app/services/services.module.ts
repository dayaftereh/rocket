import { NgModule } from "@angular/core";
import { GlobalsServiceModule } from "./globals/globals-service.module";
import { SerialServiceModule } from "./serial/serial-service.module";

@NgModule({
    imports: [
        // custom
        SerialServiceModule,
        GlobalsServiceModule
    ]
})
export class ServicesModule {

}