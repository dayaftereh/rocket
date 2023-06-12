import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils } from "lrocket";
import { RocketTelemetryWebMessage, WebMessageType, WebRocketConnectionService } from "lrocket";

@Component({
    selector: 'app-rocket-telemetry',
    templateUrl: './rocket-telemetry.component.html'
})
export class RocketTelemetryComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    private timer: any | undefined
    private startTime: number

    constructor(
        private readonly webRocketConnectionService: WebRocketConnectionService
    ) {
        this.startTime = Date.now()
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            voltage: new FormControl(4.2),
            altitude: new FormControl(1.0),

            rotationX: new FormControl(0.0),
            rotationY: new FormControl(0.0),
            rotationZ: new FormControl(0.0),

            gyroscopeX: new FormControl(0.0),
            gyroscopeY: new FormControl(0.0),
            gyroscopeZ: new FormControl(0.0),

            accelerationX: new FormControl(0.0),
            accelerationY: new FormControl(0.0),
            accelerationZ: new FormControl(9.81),

            magnetometerX: new FormControl(3.0),
            magnetometerY: new FormControl(0.0),
            magnetometerZ: new FormControl(0.0),
        })
    }

    ngOnInit(): void {
        let lastEmit: number = Date.now()
        this.timer = setInterval(() => {
            const time: number = Date.now()
            const elapsed: number = time - lastEmit
            lastEmit = time

            this.emitTelemetry(time - this.startTime, elapsed)
        }, 1000 / 10)
    }

    private getRocketTelemetryWebMessage(): RocketTelemetryWebMessage {
        const voltage: number = FormUtils.getValueOrDefault(this.formGroup, 'voltage', 4.2)
        const altitude: number = FormUtils.getValueOrDefault(this.formGroup, 'altitude', 1.0)

        const rotationX: number = FormUtils.getValueOrDefault(this.formGroup, 'rotationX', 0.0)
        const rotationY: number = FormUtils.getValueOrDefault(this.formGroup, 'rotationY', 0.0)
        const rotationZ: number = FormUtils.getValueOrDefault(this.formGroup, 'rotationZ', 0.0)

        const gyroscopeX: number = FormUtils.getValueOrDefault(this.formGroup, 'gyroscopeX', 0.0)
        const gyroscopeY: number = FormUtils.getValueOrDefault(this.formGroup, 'gyroscopeY', 0.0)
        const gyroscopeZ: number = FormUtils.getValueOrDefault(this.formGroup, 'gyroscopeZ', 0.0)

        const accelerationX: number = FormUtils.getValueOrDefault(this.formGroup, 'accelerationX', 0.0)
        const accelerationY: number = FormUtils.getValueOrDefault(this.formGroup, 'accelerationY', 0.0)
        const accelerationZ: number = FormUtils.getValueOrDefault(this.formGroup, 'accelerationZ', 0.0)

        const magnetometerX: number = FormUtils.getValueOrDefault(this.formGroup, 'magnetometerX', 0.0)
        const magnetometerY: number = FormUtils.getValueOrDefault(this.formGroup, 'magnetometerY', 0.0)
        const magnetometerZ: number = FormUtils.getValueOrDefault(this.formGroup, 'magnetometerZ', 0.0)

        return {
            time: 0,
            elapsed: 0,
            voltage,
            altitude,
            rotationX,
            rotationY,
            rotationZ,
            gyroscopeX,
            gyroscopeY,
            gyroscopeZ,
            accelerationX,
            accelerationY,
            accelerationZ,
            magnetometerX,
            magnetometerY,
            magnetometerZ,
            type: WebMessageType.RocketTelemetry,
        } as RocketTelemetryWebMessage
    }

    private emitTelemetry(time: number, elapsed: number): void {
        const message: RocketTelemetryWebMessage = this.getRocketTelemetryWebMessage()
        message.time = time
        message.elapsed = elapsed

        this.webRocketConnectionService.send(message)
    }

    ngOnDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
}