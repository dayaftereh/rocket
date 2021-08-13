import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils } from "../../../../utils/form-utils";
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
            pressureOffset: new FormControl(-512),
            thrustFactor: new FormControl(1.0),
            thrustOffset: new FormControl(-231751)
        })
    }

    ngOnInit(): void {
        this.config = this.getConfig()
    }

    onReading(reading: SerialReading): void {
        this.reading = reading
        const translate: SerialReading = this.translate(reading)
        this.data.next(translate)
    }

    translate(reading: SerialReading): SerialReading {
        if (!this.config) {
            this.config = this.getConfig()
        }

        const thrust: number = reading.thrust * this.config.pressureFactor + this.config.thrustOffset
        const pressure: number = reading.pressure * this.config.pressureFactor + this.config.pressureOffset

        return {
            thrust,
            pressure,
            time: reading.time,
            delta: reading.delta,
            valve: reading.valve
        }
    }

    private getConfig(): ThrustTestConfig {
        const pressureFactor: number = FormUtils.getValueOrDefault(this.formGroup, "pressureFactor", 1.0)
        const pressureOffset: number = FormUtils.getValueOrDefault(this.formGroup, "pressureOffset", -512)
        const thrustFactor: number = FormUtils.getValueOrDefault(this.formGroup, "thrustFactor", 1.0)
        const thrustOffset: number = FormUtils.getValueOrDefault(this.formGroup, "thrustOffset", -231751)

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