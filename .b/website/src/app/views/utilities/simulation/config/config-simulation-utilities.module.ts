import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { GlobalsServiceModule } from "../../../../services/globals/globals-service.module";
import { ConfigSimulationUtilitiesComponent } from "./config-simulation-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // Primeng
        CardModule,
        ButtonModule,
        InputTextModule,
        // Custom
        GlobalsServiceModule
    ],
    declarations: [
        ConfigSimulationUtilitiesComponent
    ],
    exports: [
        ConfigSimulationUtilitiesComponent
    ]
})
export class ConfigSimulationUtilitiesModule {

}