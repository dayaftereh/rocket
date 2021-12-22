import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UIChart } from "primeng/chart";
import { Subscription } from "rxjs";
import { bufferTime } from "rxjs/operators";
import { SingleSimulationConfig } from "src/app/services/simulation/single/single-simulation-config";
import { FormUtils } from "src/app/utils/form-utils";
import { SingleSimulationResult } from "../../../services/simulation/single/single-simulation-result";
import { SingleSimulationStep } from "../../../services/simulation/single/single-simulation-step";
import { SingleSimulationService } from "../../../services/simulation/single/single-simulation.service";
import { SingleSimulationChart } from "./single-simulation-chart";

@Component({
    templateUrl: './single-simulation.component.html'
})
export class SingleSimulationComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    @ViewChild('chart')
    chart: UIChart | undefined

    simulationChart: SingleSimulationChart

    result: SingleSimulationResult | undefined

    private subscriptions: Subscription[]

    constructor(
        private readonly singleSimulationService: SingleSimulationService
    ) {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
        this.simulationChart = new SingleSimulationChart()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            timeStep: new FormControl(0.0),
            waterAmount: new FormControl(0.0),
            rocketWeight: new FormControl(0.0),
            tankVolume: new FormControl(0.0),
            initialPressure: new FormControl(0.0),
            dragCoefficient: new FormControl(0.0),
            rocketDiameter: new FormControl(0.0),
            nozzleDiameter: new FormControl(0.0),
        })
    }

    ngOnInit(): void {
        this.simulationChart.init()

        const configSubscription: Subscription = this.singleSimulationService.configAsObservable().subscribe((config: SingleSimulationConfig) => {
            this.formGroup.patchValue(config, {
                emitEvent: false
            })
        })

        const stepsSubscription: Subscription = this.singleSimulationService.stepsAsObservable()
            .pipe(
                bufferTime(100),
            )
            .subscribe((steps: SingleSimulationStep[]) => {
                this.onSimulationSteps(steps)
            })

        this.subscriptions.push(configSubscription, stepsSubscription)
    }

    private onSimulationSteps(steps: SingleSimulationStep[]): void {
        this.simulationChart.load(steps)
        if (this.chart) {
            this.chart.refresh()
        }
    }

    async ngSubmit(): Promise<void> {
        this.result = undefined
        this.simulationChart.clear()
        const config: SingleSimulationConfig = this.getSingleSimulationConfig()
        this.result = await this.singleSimulationService.execute(config)
    }

    private getSingleSimulationConfig(): SingleSimulationConfig {
        const defaultConfig: SingleSimulationConfig = this.singleSimulationService.defaultConfig()

        const timeStep: number = FormUtils.getValueOrDefault(this.formGroup, 'timeStep', defaultConfig.timeStep)
        const waterAmount: number = FormUtils.getValueOrDefault(this.formGroup, 'waterAmount', defaultConfig.waterAmount)
        const rocketWeight: number = FormUtils.getValueOrDefault(this.formGroup, 'rocketWeight', defaultConfig.rocketWeight)
        const tankVolume: number = FormUtils.getValueOrDefault(this.formGroup, 'tankVolume', defaultConfig.tankVolume)
        const initialPressure: number = FormUtils.getValueOrDefault(this.formGroup, 'initialPressure', defaultConfig.initialPressure)
        const dragCoefficient: number = FormUtils.getValueOrDefault(this.formGroup, 'dragCoefficient', defaultConfig.dragCoefficient)
        const rocketDiameter: number = FormUtils.getValueOrDefault(this.formGroup, 'rocketDiameter', defaultConfig.rocketDiameter)
        const nozzleDiameter: number = FormUtils.getValueOrDefault(this.formGroup, 'nozzleDiameter', defaultConfig.nozzleDiameter)

        return {
            timeStep,
            waterAmount,
            rocketWeight,
            tankVolume,
            initialPressure,
            dragCoefficient,
            rocketDiameter,
            nozzleDiameter,
        }
    }

    onResetChart(): void {
        if (!this.chart || !this.chart.chart) {
            return
        }
        this.chart.chart.resetZoom()
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}