import { Component, ViewChild } from "@angular/core";
import { ControlThrustTestUtilitiesComponent } from "./control/control-thrust-test-utilities.component";
import { ThrustTestConfig } from "./control/thrust-test-config";
import { ReadingThrustTestUtilitiesComponent } from "./reading/reading-thrust-test-utilities.component";
import { SerialReading } from "./serial/serial-reading";
import { SerialThrustTestUtilitiesComponent } from "./serial/serial-thrust-test-utilities.component";

@Component({
    templateUrl: './thrust-test-utilities.component.html'
})
export class ThrustTestUtilitiesComponent {

    error: boolean

    errorText: string | undefined

    @ViewChild('serial')
    serial: SerialThrustTestUtilitiesComponent | undefined

    @ViewChild('control')
    control: ControlThrustTestUtilitiesComponent | undefined

    @ViewChild('reading')
    reading: ReadingThrustTestUtilitiesComponent | undefined

    constructor() {

    }

    onData(reading: SerialReading): void {
        if (this.control) {
            this.control.onReading(reading)
        }
    }

    onControl(config: ThrustTestConfig): void {

    }

    onReading(reading: SerialReading): void {
        if (this.reading) {
            this.reading.onReading(reading)
        }
    }

}