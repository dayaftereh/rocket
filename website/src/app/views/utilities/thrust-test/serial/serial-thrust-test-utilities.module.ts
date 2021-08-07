import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { ListboxModule } from "primeng/listbox";
import { SerialServiceModule } from "../../../../services/serial/serial-service.module";
import { SerialThrustTestUtilitiesComponent } from "./serial-thrust-test-utilities.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        ListboxModule,
        //Custom
        SerialServiceModule
    ],
    declarations: [
        SerialThrustTestUtilitiesComponent
    ],
    exports: [
        SerialThrustTestUtilitiesComponent
    ]
})
export class SerialThrustTestUtilitiesModule {

}