import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils, MultipleSimulationConfig, MultipleSimulationService, MultipleSimulationStep } from "lrocket";
import { Subscription } from "rxjs";

@Component({
    templateUrl: './multiple-simulation.component.html'
})
export class MultipleSimulationComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    results: MultipleSimulationStep[]

    progress: number

    private subscriptions: Subscription[]

    constructor(
        private readonly multipleSimulationService: MultipleSimulationService
    ) {
        this.progress = 0
        this.results = []
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            timeStep: new FormControl(),
            tankVolume: new FormControl(),
            rocketWeight: new FormControl(),
            rocketDiameter: new FormControl(),
            initialPressure: new FormControl(),
            dragCoefficient: new FormControl(),

            nozzleDiameterStep: new FormControl(),
            nozzleDiameterMinimum: new FormControl(),
            nozzleDiameterMaximum: new FormControl(),

            waterAmountStep: new FormControl(),
            waterAmountMinimum: new FormControl(),
            waterAmountMaximum: new FormControl(),

            limit: new FormControl(),
        })
    }

    ngOnInit(): void {
        const configSubscription: Subscription = this.multipleSimulationService.configAsObservable().subscribe((config: MultipleSimulationConfig) => {
            this.onConfig(config)
        })

        const stepSubscription: Subscription = this.multipleSimulationService.stepsAsObservable().subscribe((step: MultipleSimulationStep) => {
            this.onStep(step)
        })

        this.subscriptions.push(configSubscription, stepSubscription)
    }

    private onConfig(config: MultipleSimulationConfig): void {
        this.formGroup.patchValue(
            Object.assign({}, config.base, config)
            , {
                emitEvent: false
            })
    }

    private onStep(step: MultipleSimulationStep): void {
        this.progress = +(step.progress * 100.0).toFixed(1)
    }

    private getMultipleSimulationConfig(): MultipleSimulationConfig {
        const defaultConfig: MultipleSimulationConfig = this.multipleSimulationService.defaultConfig()

        const rocketWeight: number = FormUtils.getValueOrDefault(this.formGroup, "rocketWeight", defaultConfig.base.rocketWeight)
        const tankVolume: number = FormUtils.getValueOrDefault(this.formGroup, "tankVolume", defaultConfig.base.tankVolume)
        const rocketDiameter: number = FormUtils.getValueOrDefault(this.formGroup, "rocketDiameter", defaultConfig.base.rocketDiameter)
        const initialPressure: number = FormUtils.getValueOrDefault(this.formGroup, "initialPressure", defaultConfig.base.initialPressure)
        const dragCoefficient: number = FormUtils.getValueOrDefault(this.formGroup, "dragCoefficient", defaultConfig.base.dragCoefficient)
        const timeStep: number = FormUtils.getValueOrDefault(this.formGroup, "timeStep", defaultConfig.base.timeStep)

        const nozzleDiameterStep: number = FormUtils.getValueOrDefault(this.formGroup, "nozzleDiameterStep", defaultConfig.nozzleDiameterStep)
        const nozzleDiameterMinimum: number = FormUtils.getValueOrDefault(this.formGroup, "nozzleDiameterMinimum", defaultConfig.nozzleDiameterMinimum)
        const nozzleDiameterMaximum: number = FormUtils.getValueOrDefault(this.formGroup, "nozzleDiameterMaximum", defaultConfig.nozzleDiameterMaximum)

        const waterAmountStep: number = FormUtils.getValueOrDefault(this.formGroup, "waterAmountStep", defaultConfig.waterAmountStep)
        const waterAmountMinimum: number = FormUtils.getValueOrDefault(this.formGroup, "waterAmountMinimum", defaultConfig.waterAmountMinimum)
        const waterAmountMaximum: number = FormUtils.getValueOrDefault(this.formGroup, "waterAmountMaximum", defaultConfig.waterAmountMaximum)

        const limit: number = FormUtils.getValueOrDefault(this.formGroup, "limit", defaultConfig.limit)

        return {
            base: {
                dragCoefficient,
                initialPressure,
                nozzleDiameter: 0,
                rocketDiameter,
                rocketWeight,
                tankVolume,
                timeStep,
                waterAmount: 0,
            },
            limit,
            nozzleDiameterMaximum,
            nozzleDiameterMinimum,
            nozzleDiameterStep,
            waterAmountMaximum,
            waterAmountMinimum,
            waterAmountStep
        }
    }

    async onSubmit(): Promise<void> {
        const config: MultipleSimulationConfig = this.getMultipleSimulationConfig()
        this.results = await this.multipleSimulationService.execute(config)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}