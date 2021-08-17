import { Component } from "@angular/core";
import { Globals } from "../../../../services/globals/globals";
import { GlobalsService } from "../../../../services/globals/globals.service";
import { Medium } from "../../../../utils/medium";
import { SerialReading } from "../serial/serial-reading";
import { ThrustTestSimulationModel } from "../simulation-model/thrust-test-simulation-model";
import { ThrustTestChart } from "./thrust-test-chart";

@Component({
    selector: 'app-charts-thrust-test-utilities',
    templateUrl: './charts-thrust-test-utilities.component.html'
})
export class ChartsThrustTestUtilitiesComponent {

    chart: ThrustTestChart

    private data: SerialReading[]

    constructor(private readonly globalsService: GlobalsService) {
        this.data = []
        this.chart = new ThrustTestChart()
    }

    readings(readings: SerialReading[]): void {
        this.data = readings
        this.chart.update(readings)
    }

    simulationModel(simulationModel: ThrustTestSimulationModel): void {
        if (!simulationModel.enabled || !this.data) {
            this.chart.simulationModel([], [])
            return
        }

        const globals: Globals = this.globalsService.get()

        let rho: number
        if (simulationModel.medium === Medium.Air) {
            rho = globals.rhoAir
        } else if (simulationModel.medium === Medium.Water) {
            rho = globals.rhoWater
        }

        const a: number = Math.PI * Math.pow(simulationModel.radius / 1000.0, 2.0)

        const thrust: any[] = []
        const pressure: any[] = []

        this.data.forEach((reading: SerialReading) => {
            const time: number = reading.time / 1000.0
            const deltaTime: number = (reading.delta / 1000.0)


            // thrust from pressure
            const pP: number = reading.pressure * 100000.0
            const pDelta: number = pP - globals.pAmb

            let f: number = 0.0
            if (pDelta > 0.0) {
                const vP: number = Math.sqrt((2.0 * pDelta) / rho)
                const mP: number = a * vP * rho
                f = mP * vP * deltaTime
            }

            thrust.push({
                x: time,
                y: f
            })


            // pressure from thrust
            const fT: number = Math.abs(reading.thrust)
            const vT: number = Math.sqrt(fT / (a * rho * deltaTime))
            const pT: number = (1.0 / 2.0) * ((rho * (vT * vT)) + (2.0 * globals.pAmb))

            pressure.push({
                x: time,
                y: pT / 100000.0
            })

        })

        this.chart.simulationModel(pressure, thrust)
    }
}