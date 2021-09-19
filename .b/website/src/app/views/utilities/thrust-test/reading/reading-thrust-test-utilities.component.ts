import { Component } from "@angular/core";
import { SerialReading } from "../serial/serial-reading";

@Component({
    selector: './app-reading-thrust-test-utilities',
    templateUrl: './reading-thrust-test-utilities.component.html'
})
export class ReadingThrustTestUtilitiesComponent {

    reading: SerialReading | undefined

    constructor() {
    }

    onReading(reading: SerialReading): void {
        this.reading = reading
    }

}