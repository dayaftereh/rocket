import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormUtils, SingleSimulationConfig, SingleSimulationResult, SingleSimulationService, SingleSimulationStep } from "lrocket";
import { UIChart } from "primeng/chart";
import { auditTime, Subject, Subscription } from "rxjs";
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

    private repaint: Subject<void>

    private subscriptions: Subscription[]

    constructor(
        private readonly singleSimulationService: SingleSimulationService
    ) {
        this.subscriptions = []
        this.repaint = new Subject<void>();
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

        const stepsSubscription: Subscription = this.singleSimulationService.stepsAsObservable().subscribe((step: SingleSimulationStep) => {
            this.onSimulationSteps(step)
        })

        const repaintSubscription: Subscription = this.repaint.pipe(auditTime(100)).subscribe(() => {
            this.onRepaint()
        })

        this.subscriptions.push(configSubscription, stepsSubscription, repaintSubscription)
    }

    private onRepaint(): void {
        if (this.chart) {
            this.chart.refresh()
        }
    }

    private onSimulationSteps(step: SingleSimulationStep): void {
        this.simulationChart.appendStep(step)
        this.repaint.next()
    }

    async ngSubmit(): Promise<void> {
        this.result = undefined
        this.simulationChart.clear()
        const config: SingleSimulationConfig = this.getSingleSimulationConfig()
        this.result = await this.singleSimulationService.execute(config)
        this.repaint.next()
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

    async cancel(): Promise<void> {
        await this.singleSimulationService.cancel()
    }

    async clear(): Promise<void> {
        this.result = undefined
        this.simulationChart.clear()
        this.repaint.next()
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