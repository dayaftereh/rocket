import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { MultipleSimulationServiceModule } from "src/app/services/simulation/multiple/multiple-simulation-service.module";
import { MultipleSimulationComponent } from "./multiple-simulation.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ProgressBarModule,
        // Custom
        MultipleSimulationServiceModule,
    ],
    declarations: [
        MultipleSimulationComponent
    ],
    exports: [
        MultipleSimulationComponent
    ]
})
export class MultipleSimulationModule {

}