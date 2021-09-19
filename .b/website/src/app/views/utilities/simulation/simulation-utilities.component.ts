import { Component, ViewChild } from "@angular/core";
import { ChartsSimulationUtilitiesComponent } from "./charts/charts-simulation-utilities.component";
import { SimulationConfig } from "./config/simulation-config";
import { SimulationCalculator } from "./core/simulation-calculator";
import { SimulationStep } from "./core/simulation-step";

@Component({
    templateUrl: './simulation-utilities.component.html'
})
export class SimulationUtilitiesComponent {

    @ViewChild('charts')
    charts: ChartsSimulationUtilitiesComponent | undefined

    constructor() {

    }

    onConfig(config: SimulationConfig): void {
        const calculator: SimulationCalculator = new SimulationCalculator(config)
        const steps: SimulationStep[] = calculator.run()
        if (this.charts) {
            this.charts.update(steps)
        }
    }

}