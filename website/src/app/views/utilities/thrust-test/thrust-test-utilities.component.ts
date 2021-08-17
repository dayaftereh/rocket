import { AfterContentInit, Component, ViewChild } from "@angular/core";
import { ChartsThrustTestUtilitiesComponent } from "./charts/charts-thrust-test-utilities.component";
import { ControlThrustTestUtilitiesComponent } from "./control/control-thrust-test-utilities.component";
import { ThrustTestConfig } from "./control/thrust-test-config";
import { ExportThrustTestUtilitiesComponent } from "./export/export-thrust-test-utilities.component";
import { ReadingThrustTestUtilitiesComponent } from "./reading/reading-thrust-test-utilities.component";
import { SerialReading } from "./serial/serial-reading";
import { SerialThrustTestUtilitiesComponent } from "./serial/serial-thrust-test-utilities.component";
import { ThrustTestSimulationModel } from "./simulation-model/thrust-test-simulation-model";


@Component({
    templateUrl: './thrust-test-utilities.component.html'
})
export class ThrustTestUtilitiesComponent implements AfterContentInit {

    error: string | undefined

    @ViewChild('serial')
    serial: SerialThrustTestUtilitiesComponent | undefined

    @ViewChild('control')
    control: ControlThrustTestUtilitiesComponent | undefined

    @ViewChild('reading')
    reading: ReadingThrustTestUtilitiesComponent | undefined

    @ViewChild('charts')
    charts: ChartsThrustTestUtilitiesComponent | undefined

    @ViewChild('export')
    export: ExportThrustTestUtilitiesComponent | undefined

    private started: boolean

    private data: SerialReading[]

    constructor() {
        this.data = []
        this.started = false
        this.error = undefined
    }

    ngAfterContentInit(): void {
        if (this.export) {
            this.export.readings(this.data)
        }

        if (this.charts) {
            this.charts.readings(this.data)
        }
    }

    onError(e: Error): void {
        console.error(e)
        this.error = `${e.name} - ${e.message}`
        if (e.stack !== undefined && e.stack !== null) {
            this.error = `${this.error} :: ${e.stack}`
        }
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
        this.updateChartAndExport()
    }

    onSimulationModel(simulationModel: ThrustTestSimulationModel): void {
        if (this.charts) {
            this.charts.simulationModel(simulationModel)
        }
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

        this.updateChartAndExport()
    }

    private updateChartAndExport(): void {
        if (!this.control) {
            return
        }

        const data: SerialReading[] = this.data.map((reading: SerialReading) => {
            return this.control!.translate(reading)
        })

        if (this.charts) {
            this.charts.readings(data)
        }

        if (this.export) {
            this.export.readings(data)
        }
    }



}