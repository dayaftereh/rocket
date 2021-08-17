import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { FormUtils } from "../../../../utils/form-utils";
import { Medium } from "../../../../utils/medium";
import { ThrustTestSimulationModel } from "./thrust-test-simulation-model";

@Component({
    selector: './app-simulation-model-thrust-test-utilities',
    templateUrl: './simulation-model-thrust-test-utilities.component.html'
})
export class SimulationModelThrustTestUtilitiesComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    mediums: SelectItem[]

    @Output()
    simulationModel: EventEmitter<ThrustTestSimulationModel>

    private subscriptions: Subscription[]

    constructor() {
        this.mediums = []
        this.subscriptions = []
        this.formGroup = this.create()
        this.simulationModel = new EventEmitter<ThrustTestSimulationModel>(true)
    }

    private create(): FormGroup {
        return new FormGroup({
            radius: new FormControl(3.1),
            medium: new FormControl(Medium.Air),
            enabled: new FormControl(true),
        })
    }

    ngOnInit(): void {
        this.mediums.push(
            {
                label: 'Air',
                value: Medium.Air
            },
            {
                label: 'Water',
                value: Medium.Water
            }
        )

        const subscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onSubmit()
        })

        this.subscriptions.push(subscription)
    }

    onSubmit(): void {
        const simulationModel: ThrustTestSimulationModel = this.getSimulationModel()
        this.simulationModel.next(simulationModel)
    }

    private getSimulationModel(): ThrustTestSimulationModel {
        const radius: number = FormUtils.getValueOrDefault(this.formGroup, "radius", 3.1)
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)
        const medium: Medium = FormUtils.getValueOrDefault(this.formGroup, "medium", Medium.Air)
        return {
            medium,
            enabled,
            radius,
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}