import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ListboxModule } from 'primeng/listbox';
import { MessageModule } from 'primeng/message';
import { SerialServiceModule } from "../../../services/serial/serial-service.module";
import { ThrustTestUtilitiesComponent } from "./thrust-test-utilities.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        // PrimeNG
        ChartModule,
        ButtonModule,
        ListboxModule,
        MessageModule,
        //Custom
        SerialServiceModule
    ],
    declarations: [
        ThrustTestUtilitiesComponent
    ],
    exports: [
        ThrustTestUtilitiesComponent
    ]
})
export class ThrustTestUtilitiesModule {

}