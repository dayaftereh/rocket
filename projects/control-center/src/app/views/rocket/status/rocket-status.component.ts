import { Component, OnDestroy, OnInit } from "@angular/core";
import { RocketStatusWebMessage, WebRocketConnectionService } from "lrocket";
import { RocketService } from "../../../services/rocket/rocket.service";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-rocket-status',
    templateUrl: './rocket-status.component.html'
})
export class RocketStatusComponent implements OnInit, OnDestroy {

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
            state: new FormControl(),
            error: new FormControl(),
        })
    }

    ngOnInit(): void {
        this.formGroup.disable()
        
        const statusSubscription: Subscription = this.rocketService.statusAsObservable().subscribe((status: RocketStatusWebMessage) => {
            this.onStatus(status)
        })
        this.subscriptions.push(statusSubscription)
    }

    private onStatus(status: RocketStatusWebMessage): void {
        this.formGroup.patchValue(status)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}