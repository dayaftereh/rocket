import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LocalStorageService } from "../../../../services/local-storage/local-storage.service";
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

    private localStorageName: string = "thrust-test-utilities"

    constructor(private readonly localStorageService: LocalStorageService) {
        this.formGroup = this.create()
        this.data = new EventEmitter<SerialReading>(true)
        this.control = new EventEmitter<ThrustTestConfig>(true)
    }

    private create(): FormGroup {
        return new FormGroup({
            pressureFactor: new FormControl(),
            pressureOffset: new FormControl(),
            thrustFactor: new FormControl(),
            thrustOffset: new FormControl()
        })
    }

    private defaultConfig(): ThrustTestConfig {
        return {
            pressureFactor: 0.01291,
            pressureOffset: -1.30391,
            thrustFactor: 0.00002116,
            thrustOffset: -233348
        }
    }

    ngOnInit(): void {
        const defaultConfig: ThrustTestConfig = this.defaultConfig()
        this.config = this.localStorageService.getObjectOrDefault(this.localStorageName, defaultConfig)
        this.formGroup.patchValue(
            this.config,
            {
                emitEvent: false
            }
        )

        this.formGroup.valueChanges.subscribe(() => {
            this.config = this.getConfig()
            this.localStorageService.updateObject(this.localStorageName, this.config)
        })
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

        const thrust: number = (reading.thrust + this.config.thrustOffset) * this.config.thrustFactor
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
        const defaultConfig: ThrustTestConfig = this.defaultConfig()
        const pressureFactor: number = FormUtils.getValueOrDefault(this.formGroup, "pressureFactor", defaultConfig.pressureFactor)
        const pressureOffset: number = FormUtils.getValueOrDefault(this.formGroup, "pressureOffset", defaultConfig.pressureOffset)
        const thrustFactor: number = FormUtils.getValueOrDefault(this.formGroup, "thrustFactor", defaultConfig.thrustFactor)
        const thrustOffset: number = FormUtils.getValueOrDefault(this.formGroup, "thrustOffset", defaultConfig.thrustOffset)

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

    reset(): void {
        const defaultConfig: ThrustTestConfig = this.defaultConfig()
        this.formGroup.patchValue(defaultConfig)
    }

    onSubmit(): void {
        this.config = this.getConfig()
        this.localStorageService.updateObject(this.localStorageName, this.config)
        this.control.next(this.config)
    }

}