import { SingleSimulationStep } from "src/app/services/simulation/single-simulation-step";
import { Chart } from "src/app/utils/chart";

export class SingleSimulationChart extends Chart {

    private datasetHeight: any
    private datasetVelocity: any

    private xAxisId: string = 'x-axis-0'
    private yAxisId: string = 'y-axis-0'


    constructor() {
        super()
    }

    init(): void {
        const scales: any = {}
        scales[this.xAxisId] = this.createLinearAxis("x")
        scales[this.yAxisId] = this.createLinearAxis("y")

        this.options = this.createDefaultOptions({
            scales,
        })
        this.plugins = this.createDefaultPlugins()

        this.datasetHeight = this.createDataset('Heigth', '#f00', this.xAxisId, this.yAxisId)
        this.datasetVelocity = this.createDataset('Velocity', '#0f0', this.xAxisId, this.yAxisId)

        this.data = {
            datasets: [
                this.datasetHeight,
                this.datasetVelocity
            ]
        }
    }

    load(steps: SingleSimulationStep[]): void {
        steps.forEach((step: SingleSimulationStep) => {
            this.datasetHeight.data.push({
                x: step.time,
                y: step.height
            })

            this.datasetVelocity.data.push({
                x: step.time,
                y: step.velocity
            })
        })
    }

}