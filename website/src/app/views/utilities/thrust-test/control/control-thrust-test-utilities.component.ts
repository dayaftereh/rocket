import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils } from "src/app/utils/form-utils";
import { SerialReading } from "../serial/serial-reading";
import { ThrustTestConfig } from "./thrust-test-config";

@Component({
    selector: './app-control-thrust-test-utilities',
    templateUrl: './control-thrust-test-utilities.component.html'
})
export class ControlThrustTestUtilitiesComponent implements OnInit {

    formGroup: FormGroup


    @Output()
    data: EventEmitter<SerialReading>

    @Output()
    control: EventEmitter<ThrustTestConfig>

    private config: ThrustTestConfig | undefined

    private reading: SerialReading | undefined

    constructor() {
        this.formGroup = this.create()
        this.data = new EventEmitter<SerialReading>(true)
        this.control = new EventEmitter<ThrustTestConfig>(true)
    }

    private create(): FormGroup {
        return new FormGroup({
            pressureFactor: new FormControl(1.0),
            pressureOffset: new FormControl(0.0),
            thrustFactor: new FormControl(1.0),
            thrustOffset: new FormControl(0.0)
        })
    }

    ngOnInit(): void {
        this.config = this.getConfig()
    }

    onReading(reading: SerialReading): void {
        this.reading = reading

        if (!this.config) {
            return
        }

        const thrust: number = reading.thrust * this.config.pressureFactor + this.config.thrustOffset
        const pressure: number = reading.pressure * this.config.pressureFactor + this.config.pressureOffset

        this.data.next({
            thrust,
            pressure,
            time: reading.time,
            delta: reading.delta,
        })
    }

    private getConfig(): ThrustTestConfig {
        const pressureFactor: number = FormUtils.getValueOrDefault(this.formGroup, "pressureFactor", 1.0)
        const pressureOffset: number = FormUtils.getValueOrDefault(this.formGroup, "pressureOffset", 0.0)
        const thrustFactor: number = FormUtils.getValueOrDefault(this.formGroup, "thrustFactor", 1.0)
        const thrustOffset: number = FormUtils.getValueOrDefault(this.formGroup, "thrustOffset", 0.0)

        return {
            pressureFactor,
            pressureOffset,
            thrustFactor,
            thrustOffset
        }
    }

    tara(): void {
        if (!this.reading) {
            return
        }
        const pressure: number = this.reading.pressure
        this.formGroup.patchValue({
            pressureOffset: -pressure
        })
        this.onSubmit()
    }

    onSubmit(): void {
        this.config = this.getConfig()
        this.control.next(this.config)
    }

}