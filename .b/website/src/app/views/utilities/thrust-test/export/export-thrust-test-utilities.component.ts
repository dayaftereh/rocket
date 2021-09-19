import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { CSVExporterUtilitiesComponent } from "../../csv-exporter/csv-exporter-utilities.component";
import { SerialReading } from "../serial/serial-reading";

@Component({
    selector: './app-export-thrust-test-utilities',
    templateUrl: './export-thrust-test-utilities.component.html'
})
export class ExportThrustTestUtilitiesComponent implements AfterViewInit {

    @ViewChild('exporter')
    exporter: CSVExporterUtilitiesComponent | undefined

    constructor() {

    }

    readings(data: SerialReading[]): void {
        const exportData: any[][] = data.map((reading: SerialReading) => {
            return [
                reading.time / 1000.0,
                reading.delta,
                reading.pressure,
                reading.thrust,
                reading.valve ? 1 : 0,
            ]
        })

        exportData.unshift([
            'Time(s)',
            'Delta(ms)',
            'Pressure(bar)',
            'Thrust(n)',
            'Valve'
        ])

        if (this.exporter) {
            this.exporter.setData(exportData)
        }
    }

    ngAfterViewInit(): void {
        if (this.exporter) {
            this.exporter.setFilename('thrust-test-result.csv')
        }
    }



}