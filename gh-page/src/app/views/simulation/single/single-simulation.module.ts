import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { InputTextModule } from "primeng/inputtext";
import { SimulationServiceModule } from "src/app/services/simulation/simulation-service.module";
import { ChartJsModule } from "../../chartjs/chartjs.module";
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
        ChartJsModule,
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