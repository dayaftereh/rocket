import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { RocketStatusWebMessage, RocketTelemetryWebMessage, WebControlCenterConnectionService } from "lrocket";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-dashboard-rocket-overview',
    templateUrl: './dashboard-rocket-overview.component.html'
})
export class DashboardRocketOverviewComponent {

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            state: new FormControl(),
            error: new FormControl(),
            voltage: new FormControl(0),
            altitude: new FormControl(-1),
            time: new FormControl(0),
            elapsed: new FormControl(0),
        })
    }

    ngOnInit(): void {
        this.formGroup.disable()

        const statusSubscription: Subscription = this.webControlCenterConnectionService.rocketStatus().subscribe((status: RocketStatusWebMessage) => {
            this.onStatus(status)
        })

        const telemetrySubscription: Subscription = this.webControlCenterConnectionService.rocketTelemetry().subscribe((telemetry: RocketTelemetryWebMessage) => {
            this.onTelemetry(telemetry)
        })

        this.subscriptions.push(statusSubscription, telemetrySubscription)
    }

    private onStatus(status: RocketStatusWebMessage): void {
        this.formGroup.patchValue(status)
    }

    private onTelemetry(telemetry: RocketTelemetryWebMessage): void {
        this.formGroup.patchValue(telemetry)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }



}