import { DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as FileSaver from "file-saver";
import { FormUtils } from "../../../../utils/form-utils";
import { SerialReading } from "../serial/serial-reading";

@Component({
    selector: './app-export-thrust-test-utilities',
    templateUrl: './export-thrust-test-utilities.component.html'
})
export class ExportThrustTestUtilitiesComponent {

    formGroup: FormGroup

    private data: SerialReading[]

    constructor(private readonly decimalPipe: DecimalPipe) {
        this.data = []
        this.formGroup = this.create()
    }

    private create(): FormGroup {
        return new FormGroup({
            separator: new FormControl(';'),
            newline: new FormControl('\\n'),
            filename: new FormControl('thrust-test-data.csv'),
        })
    }

    readings(readings: SerialReading[]): void {
        this.data = readings
    }

    private formatNumber(x: number): string {
        const n: string | null = this.decimalPipe.transform(x)
        if (n === null || n === undefined) {
            return `${x}`
        }
        return n
    }

    async onSubmit(): Promise<void> {
        const newline: string = FormUtils.getValueOrDefault(this.formGroup, 'newline', '\n')
        const separator: string = FormUtils.getValueOrDefault(this.formGroup, 'separator', ';')

        const lines: string[] = []

        lines.push([
            `Time(s)`, `Pressure(bar)`, `Thrust(n)`, `Valve`
        ].join(separator))

        this.data.map((reading: SerialReading) => {
            const line: string[] = [
                reading.time,
                reading.pressure,
                reading.thrust,
                reading.valve ? 1 : 0
            ].map((x: number) => {
                return this.formatNumber(x)
            })

            return line.join(separator)
        }).forEach((line: string) => {
            lines.push(line)
        })

        const content: string = lines.join(newline)
        const blob: Blob = new Blob([content])

        const filename: string = FormUtils.getValueOrDefault(this.formGroup, 'filename', 'thrust-test-data.csv')
        FileSaver.saveAs(blob, filename)
    }

}