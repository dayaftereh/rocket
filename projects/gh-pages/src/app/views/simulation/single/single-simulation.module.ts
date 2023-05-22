import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SimulationServiceModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { InputTextModule } from "primeng/inputtext";
import { SingleSimulationComponent } from "./single-simulation.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        // Primeng
        CardModule,
        ChartModule,
        ButtonModule,
        InputTextModule,
        // ChartJS
        // Custom        
        SimulationServiceModule
    ],
    declarations: [
        SingleSimulationComponent
    ],
    exports: [
        SingleSimulationComponent
    ]
})
export class SingleSimulationModule {

}