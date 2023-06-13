import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils, RocketTelemetryWebMessage, WebMessageType } from "lrocket";
import { Subscription, first } from "rxjs";
import { RocketService } from "../../../services/rocket/rocket.service";

@Component({
    selector: 'app-rocket-telemetry',
    templateUrl: './rocket-telemetry.component.html'
})
export class RocketTelemetryComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(
        private readonly rocketService: RocketService,
    ) {
        this.subscriptions = []
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

    async ngOnInit(): Promise<void> {
        const telemetrySubscription: Subscription = this.rocketService.telemetryAsObservable().pipe(
            first()
        ).subscribe((telemetry: RocketTelemetryWebMessage) => {
            this.formGroup.patchValue(telemetry)
        })

        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(telemetrySubscription, formSubscription)
    }

    private onFormChanged(): void {
        const telemetry: RocketTelemetryWebMessage = this.getRocketTelemetryWebMessage()
        this.rocketService.updateTelemetry(telemetry)
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



    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }
}