import { Component } from "@angular/core";
import { SerialReading } from "../serial/serial-reading";
import { ThrustTestChart } from "./thrust-test-chart";

@Component({
    selector: 'app-charts-thrust-test-utilities',
    templateUrl: './charts-thrust-test-utilities.component.html'
})
export class ChartsThrustTestUtilitiesComponent {

    chart: ThrustTestChart

    constructor() {
        this.chart = new ThrustTestChart()
    }

    readings(readings: SerialReading[]): void {
        this.chart.update(readings)
    }

}