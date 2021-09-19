import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { Globals } from "../../../services/globals/globals";
import { GlobalsService } from "../../../services/globals/globals.service";
import { FormUtils } from "../../../utils/form-utils";

@Component({
    templateUrl: './globals-settings.component.html'
})
export class GlobalsSettingsComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(private readonly globalsService: GlobalsService) {
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
        const globalsSubscription: Subscription = this.globalsService.asObservable().subscribe((globals: Globals) => {
            this.onGlobals(globals)
        })

        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription, globalsSubscription)
    }

    private onGlobals(globals: Globals): void {
        this.formGroup.patchValue(globals, {
            emitEvent: false
        })
    }

    private onFormChanged(): void {
        const defaultGlobals: Globals = this.globalsService.defaultGlobals()
        const g: number = FormUtils.getValueOrDefault(this.formGroup, 'g', defaultGlobals.g)
        const pAmb: number = FormUtils.getValueOrDefault(this.formGroup, 'pAmb', defaultGlobals.pAmb)
        const rhoAir: number = FormUtils.getValueOrDefault(this.formGroup, 'rhoAir', defaultGlobals.rhoAir)
        const rhoWater: number = FormUtils.getValueOrDefault(this.formGroup, 'rhoWater', defaultGlobals.rhoWater)

        this.globalsService.update({
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