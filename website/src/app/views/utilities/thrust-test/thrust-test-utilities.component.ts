import { Component, ViewChild } from "@angular/core";
import { ChartsThrustTestUtilitiesComponent } from "./charts/charts-thrust-test-utilities.component";
import { ControlThrustTestUtilitiesComponent } from "./control/control-thrust-test-utilities.component";
import { ThrustTestConfig } from "./control/thrust-test-config";
import { ReadingThrustTestUtilitiesComponent } from "./reading/reading-thrust-test-utilities.component";
import { SerialReading } from "./serial/serial-reading";
import { SerialThrustTestUtilitiesComponent } from "./serial/serial-thrust-test-utilities.component";

@Component({
    templateUrl: './thrust-test-utilities.component.html'
})
export class ThrustTestUtilitiesComponent {

    @ViewChild('serial')
    serial: SerialThrustTestUtilitiesComponent | undefined

    @ViewChild('control')
    control: ControlThrustTestUtilitiesComponent | undefined

    @ViewChild('reading')
    reading: ReadingThrustTestUtilitiesComponent | undefined

    @ViewChild('charts')
    charts: ChartsThrustTestUtilitiesComponent | undefined

    private started: boolean

    private data: SerialReading[]

    constructor() {
        this.data = []
        this.started = false
    }

    onError(e: Error): void {
        console.error(e)
    }

    onData(reading: SerialReading): void {
        if (this.control) {
            this.control.onReading(reading)
        }

        if (this.started) {
            this.data.push(reading)
        }
    }

    onControl(config: ThrustTestConfig): void {
        this.updateChart()
    }

    onReading(reading: SerialReading): void {
        if (this.reading) {
            this.reading.onReading(reading)
        }
    }

    onStart(): void {
        this.data = []
        this.started = true

        if (this.serial) {
            this.serial.openValve()
        }
    }

    onStop(): void {
        this.started = false

        if (this.serial) {
            this.serial.closeValve()
        }

        this.updateChart()
    }

    private updateChart(): void {
        if (!this.control || !this.charts) {
            return
        }

        const data: SerialReading[] = this.data.map((reading: SerialReading) => {
            return this.control!.translate(reading)
        })

        this.charts.readings(data)
    }

}