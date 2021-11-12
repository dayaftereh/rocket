import { Chart } from "src/app/utils/chart";
import { AvionicsDataEntry } from "./avionics-data-entry";

export class AnalyzerChart extends Chart {

    constructor() {
        super()
    }

    private datasetState: any

    private datasetElapsed: any

    private datasetVoltage: any
    private datasetAltitude: any
    private datasetMaximumAltitude: any

    private datasetParachuteVelocity: any
    private datasetParachuteAltitude: any
    private datasetParachuteOrientation: any

    private datasetAccelerationX: any
    private datasetAccelerationY: any
    private datasetAccelerationZ: any

    private datasetRotationX: any
    private datasetRotationY: any
    private datasetRotationZ: any

    private datasetVelocity: any

    private datasetVelocityX: any
    private datasetVelocityY: any
    private datasetVelocityZ: any

    private xAxisId: string = 'x-axis-0'
    private yAxisId: string = 'y-axis-0'

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

        this.datasetState = this.createDataset('State', '#fff', this.xAxisId, this.yAxisId)

        this.datasetElapsed = this.createDataset('Elapsed (s)', '#f0f', this.xAxisId, this.yAxisId)

        this.datasetVoltage = this.createDataset('Volt (V)', '#ff0', this.xAxisId, this.yAxisId)
        this.datasetAltitude = this.createDataset('Alt (m)', '#0ff', this.xAxisId, this.yAxisId)
        this.datasetMaximumAltitude = this.createDataset('M_Alt', 'hsl(80, 100%, 50%)', this.xAxisId, this.yAxisId)

        this.datasetParachuteVelocity = this.createDataset('P_Velo', '#f00', this.xAxisId, this.yAxisId)
        this.datasetParachuteAltitude = this.createDataset('P_Alt', '#0f0', this.xAxisId, this.yAxisId)
        this.datasetParachuteOrientation = this.createDataset('P_Ori', '#00f', this.xAxisId, this.yAxisId)

        this.datasetAccelerationX = this.createDataset('Acc_X', 'hsl(20, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetAccelerationY = this.createDataset('Acc_Y', 'hsl(340, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetAccelerationZ = this.createDataset('Acc_Z', 'hsl(200, 100%, 50%)', this.xAxisId, this.yAxisId)

        this.datasetRotationX = this.createDataset('Rot_X', 'hsl(40, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetRotationY = this.createDataset('Rot_Y', 'hsl(320, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetRotationZ = this.createDataset('Rot_Z', 'hsl(180, 100%, 50%)', this.xAxisId, this.yAxisId)

        this.datasetVelocity = this.createDataset('Velo', 'hsl(140, 100%, 50%)', this.xAxisId, this.yAxisId)

        this.datasetVelocityX = this.createDataset('Velo_X', 'hsl(60, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetVelocityY = this.createDataset('Velo_Y', 'hsl(300, 100%, 50%)', this.xAxisId, this.yAxisId)
        this.datasetVelocityZ = this.createDataset('Velo_Z', 'hsl(160, 100%, 50%)', this.xAxisId, this.yAxisId)

        this.datasetState.hidden = true
        this.datasetElapsed.hidden = true
        this.datasetVoltage.hidden = true
        this.datasetMaximumAltitude.hidden = true

        this.datasetVelocityX.hidden = true
        this.datasetVelocityY.hidden = true
        this.datasetVelocityZ.hidden = true

        this.datasetAccelerationX.hidden = true
        this.datasetAccelerationY.hidden = true
        this.datasetAccelerationZ.hidden = true

        this.data = {
            datasets: [
                this.datasetState ,
                this.datasetElapsed,

                this.datasetVoltage,
                this.datasetAltitude,
                this.datasetMaximumAltitude,

                this.datasetParachuteVelocity,
                this.datasetParachuteAltitude,
                this.datasetParachuteOrientation,

                this.datasetAccelerationX,
                this.datasetAccelerationY,
                this.datasetAccelerationZ,

                this.datasetRotationX,
                this.datasetRotationY,
                this.datasetRotationZ,

                this.datasetVelocityX,
                this.datasetVelocityY,
                this.datasetVelocityZ,

                this.datasetVelocity,
            ]
        }
    }



    load(entities: AvionicsDataEntry[]): void {

        this.datasetState.data = []

        this.datasetElapsed.data = []
        this.datasetVoltage.data = []

        this.datasetAltitude.data = []
        this.datasetMaximumAltitude.data = []

        this.datasetParachuteVelocity.data = []
        this.datasetParachuteAltitude.data = []
        this.datasetParachuteOrientation.data = []

        this.datasetAccelerationX.data = []
        this.datasetAccelerationY.data = []
        this.datasetAccelerationZ.data = []

        this.datasetRotationX.data = []
        this.datasetRotationY.data = []
        this.datasetRotationZ.data = []

        this.datasetVelocityX.data = []
        this.datasetVelocityY.data = []
        this.datasetVelocityZ.data = []

        this.datasetVelocity.data = []

        entities.forEach((entry: AvionicsDataEntry) => {
            const time: number = entry.time / 1000.0

            this.datasetState.data.push({
                x: time,
                y: entry.state
            })

            this.datasetElapsed.data.push({
                x: time,
                y: entry.elapsed
            })

            this.datasetVoltage.data.push({
                x: time,
                y: entry.voltage
            })

            this.datasetAltitude.data.push({
                x: time,
                y: entry.altitude
            })

            this.datasetMaximumAltitude.data.push({
                x: time,
                y: entry.maximumAltitude
            })

            this.datasetParachuteVelocity.data.push({
                x: time,
                y: entry.parachuteVelocity ? 1 : 0
            })

            this.datasetParachuteAltitude.data.push({
                x: time,
                y: entry.parachuteAltitude ? 1 : 0
            })

            this.datasetParachuteOrientation.data.push({
                x: time,
                y: entry.parachuteOrientation ? 1 : 0
            })

            this.datasetAccelerationX.data.push({
                x: time,
                y: entry.accelerationX
            })

            this.datasetAccelerationY.data.push({
                x: time,
                y: entry.accelerationY
            })

            this.datasetAccelerationZ.data.push({
                x: time,
                y: entry.accelerationZ
            })

            this.datasetRotationX.data.push({
                x: time,
                y: entry.rotationX
            })

            this.datasetRotationY.data.push({
                x: time,
                y: entry.rotationY
            })

            this.datasetRotationZ.data.push({
                x: time,
                y: entry.rotationZ
            })

            this.datasetVelocityX.data.push({
                x: time,
                y: entry.velocityX
            })

            this.datasetVelocityY.data.push({
                x: time,
                y: entry.velocityY
            })

            this.datasetVelocityZ.data.push({
                x: time,
                y: entry.velocityZ
            })

            const velocity: number = Math.sqrt(
                entry.velocityX * entry.velocityX
                + entry.velocityY * entry.velocityY
                + entry.velocityZ * entry.velocityZ
            )

            this.datasetVelocity.data.push({
                x: time,
                y: velocity
            })

        })
    }
}