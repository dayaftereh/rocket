import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { Constants } from "src/app/services/constants/constants";
import { ConstantsService } from "src/app/services/constants/constants.service";
import { FormUtils } from "../../../utils/form-utils";

@Component({
    templateUrl: './constants-settings.component.html'
})
export class ConstantsSettingsComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(private readonly constantsService: ConstantsService) {
        this.formGroup = this.create()
        this.subscriptions = []
    }

    private create(): FormGroup {
        return new FormGroup({
            g: new FormControl(),
            pAmb: new FormControl(),
            rhoAir: new FormControl(),
            rhoWater: new FormControl(),
        })
    }

    ngOnInit(): void {
        const constantsSubscription: Subscription = this.constantsService.asObservable().subscribe((constants: Constants) => {
            this.onConstants(constants)
        })

        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription, constantsSubscription)
    }

    private onConstants(constants: Constants): void {
        this.formGroup.patchValue(constants, {
            emitEvent: false
        })
    }

    private onFormChanged(): void {
        const constants: Constants = this.constantsService.defaultConstants()

        const g: number = FormUtils.getValueOrDefault(this.formGroup, 'g', constants.g)
        const pAmb: number = FormUtils.getValueOrDefault(this.formGroup, 'pAmb', constants.pAmb)
        const rhoAir: number = FormUtils.getValueOrDefault(this.formGroup, 'rhoAir', constants.rhoAir)
        const rhoWater: number = FormUtils.getValueOrDefault(this.formGroup, 'rhoWater', constants.rhoWater)

        this.constantsService.update({
            g,
            pAmb,
            rhoAir,
            rhoWater
        })
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }


}