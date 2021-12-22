import { Chart } from "src/app/utils/chart";
import { SingleSimulationStep } from "../../../services/simulation/single/single-simulation-step";

export class SingleSimulationChart extends Chart {

    private datasetMass: any
    private datasetHeight: any
    private datasetThrust: any
    private datasetVelocity: any
    private datasetPressure: any
    private datasetAcceleration: any
    private datasetFlowVelocity: any
    private datasetMassFlowRate: any

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
            plugins: {
                zoom: {
                    pan: {
                        enabled: true
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: this.fontSize
                        },
                        color: this.labelFont,
                    }
                }
            }
        })

        this.plugins = this.createDefaultPlugins()

        this.datasetMass = this.createDataset('Mass (g)', '#00f', this.xAxisId, this.yAxisId)
        this.datasetHeight = this.createDataset('Height (m)', '#f00', this.xAxisId, this.yAxisId)
        this.datasetVelocity = this.createDataset('Velocity (m/s)', '#0f0', this.xAxisId, this.yAxisId)
        this.datasetPressure = this.createDataset('Pressure (bar)', '#ff0', this.xAxisId, this.yAxisId)

        this.datasetThrust = this.createDataset('Thrust (N)', '#f0f', this.xAxisId, this.yAxisId)
        this.datasetAcceleration = this.createDataset('Acceleration (m/s2)', '#0ff', this.xAxisId, this.yAxisId)
        this.datasetFlowVelocity = this.createDataset('FlowVelocity (m/s)', '#6da3f5', this.xAxisId, this.yAxisId)
        this.datasetMassFlowRate = this.createDataset('MassFlowRate (kg/s)', '#20f54f', this.xAxisId, this.yAxisId)

        this.datasetMass.hidden = true
        this.datasetPressure.hidden = true
        this.datasetThrust.hidden = true
        this.datasetAcceleration.hidden = true
        this.datasetFlowVelocity.hidden = true
        this.datasetMassFlowRate.hidden = true

        this.data = {
            datasets: [
                this.datasetHeight,
                this.datasetVelocity,
                this.datasetThrust,
                this.datasetPressure,
                this.datasetMass,
                this.datasetAcceleration,
                this.datasetFlowVelocity,
                this.datasetMassFlowRate
            ]
        }
    }

    clear(): void {
        this.datasetMass.data = []
        this.datasetHeight.data = []
        this.datasetThrust.data = []
        this.datasetVelocity.data = []
        this.datasetPressure.data = []
        this.datasetAcceleration.data = []
        this.datasetFlowVelocity.data = []
        this.datasetMassFlowRate.data = []
    }

    appendStep(step: SingleSimulationStep): void {
        this.datasetHeight.data.push({
            x: step.time,
            y: step.height
        })

        this.datasetThrust.data.push({
            x: step.time,
            y: step.thrust
        })

        this.datasetVelocity.data.push({
            x: step.time,
            y: step.velocity
        })

        this.datasetMass.data.push({
            x: step.time,
            y: step.mass
        })

        this.datasetPressure.data.push({
            x: step.time,
            y: step.pressure
        })

        this.datasetAcceleration.data.push({
            x: step.time,
            y: step.acceleration
        })

        this.datasetFlowVelocity.data.push({
            x: step.time,
            y: step.flowVelocity
        })

        this.datasetMassFlowRate.data.push({
            x: step.time,
            y: step.massFlowRate
        })
    }

    load(steps: SingleSimulationStep[]): void {
        steps.forEach((step: SingleSimulationStep) => {
            this.appendStep(step)
        })
    }

}