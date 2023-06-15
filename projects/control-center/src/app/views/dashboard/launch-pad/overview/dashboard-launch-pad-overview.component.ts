import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LaunchPadStatusWebMessage, WebControlCenterConnectionService } from "lrocket";
import { runInZone } from "projects/lrocket/src/lib/utils/rxjs-ngzone";
import { Observable, Subscription } from "rxjs";

@Component({
    selector: 'app-dashboard-launch-pad-overview',
    templateUrl: './dashboard-launch-pad-overview.component.html'
})
export class DashboardLaunchPadOverviewComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(
        private readonly ngZone: NgZone,
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            state: new FormControl(),
            error: new FormControl(),
            voltage: new FormControl(),
            connected: new FormControl(),
        })
    }

    ngOnInit(): void {
        this.formGroup.disable()

        const statusSubscription: Subscription = this.webControlCenterConnectionService.launchPadStatus().pipe(
            runInZone(this.ngZone)
        )
            .subscribe((status: LaunchPadStatusWebMessage) => {
                this.onStatus(status)
            })
        this.subscriptions.push(statusSubscription)
    }

    private onStatus(status: LaunchPadStatusWebMessage): void {
        this.formGroup.patchValue(status)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}