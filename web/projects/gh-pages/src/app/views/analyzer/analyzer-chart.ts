import { Chart } from "src/app/utils/chart";
import { AvionicsDataEntry } from "./avionics-data-entry";
import { AvionicsDataEntryType } from "./avionics-data-entry-type";
import { AvionicsLoopEntry } from "./avionics-loop-entry";

export class AnalyzerChart extends Chart {

    constructor() {
        super()
    }

    private datasetState: any
    private datasetElapsed: any

    private datasetRotationX: any
    private datasetRotationY: any
    private datasetRotationZ: any

    private datasetRawAccelerationX: any
    private datasetRawAccelerationY: any
    private datasetRawAccelerationZ: any

    private datasetAccelerationX: any
    private datasetAccelerationY: any
    private datasetAccelerationZ: any

    private datasetWorldAccelerationX: any
    private datasetWorldAccelerationY: any
    private datasetWorldAccelerationZ: any

    private datasetZeroedAccelerationX: any
    private datasetZeroedAccelerationY: any
    private datasetZeroedAccelerationZ: any

    private datasetVelocityX: any
    private datasetVelocityY: any
    private datasetVelocityZ: any

    private xAxisId: string = 'x-axis-0'
    private yAxisId: string = 'y-axis-0'

    init(): void {
        const scales: any = {}
        scales[this.xAxisId] = this.createLinearAxis("x")
        scales[this.yAxisId] = this.createLinearAxis("y")

        scales[this.xAxisId].title = {
            display: true,
            text: 'ms'
        }

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

        let h: number = 0
        const nextHSL = () => {
            const n: number = h
            h = (h + 13) % 360
            return `hsl(${n}, 100%, 50%)`
        }

        this.plugins = this.createDefaultPlugins()

        this.datasetState = this.createDataset('State', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetElapsed = this.createDataset('Elapsed', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetRotationX = this.createDataset('Rot_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetRotationY = this.createDataset('Rot_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetRotationZ = this.createDataset('Rot_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetRawAccelerationX = this.createDataset('R_Acc_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetRawAccelerationY = this.createDataset('R_Acc_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetRawAccelerationZ = this.createDataset('R_Acc_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetAccelerationX = this.createDataset('Acc_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetAccelerationY = this.createDataset('Acc_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetAccelerationZ = this.createDataset('Acc_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetWorldAccelerationX = this.createDataset('W_Acc_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetWorldAccelerationY = this.createDataset('W_Acc_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetWorldAccelerationZ = this.createDataset('W_Acc_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetZeroedAccelerationX = this.createDataset('Z_Acc_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetZeroedAccelerationY = this.createDataset('Z_Acc_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetZeroedAccelerationZ = this.createDataset('Z_Acc_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetZeroedAccelerationX = this.createDataset('Z_Acc_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetZeroedAccelerationY = this.createDataset('Z_Acc_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetZeroedAccelerationZ = this.createDataset('Z_Acc_Z', nextHSL(), this.xAxisId, this.yAxisId)

        this.datasetVelocityX = this.createDataset('Vel_X', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetVelocityY = this.createDataset('Vel_Y', nextHSL(), this.xAxisId, this.yAxisId)
        this.datasetVelocityZ = this.createDataset('Vel_Z', nextHSL(), this.xAxisId, this.yAxisId)


        this.data = {
            datasets: [
                this.datasetState,
                this.datasetElapsed,

                this.datasetRotationX,
                this.datasetRotationY,
                this.datasetRotationZ,

                this.datasetRawAccelerationX,
                this.datasetRawAccelerationY,
                this.datasetRawAccelerationZ,

                this.datasetAccelerationX,
                this.datasetAccelerationY,
                this.datasetAccelerationZ,

                this.datasetWorldAccelerationX,
                this.datasetWorldAccelerationY,
                this.datasetWorldAccelerationZ,

                this.datasetZeroedAccelerationX,
                this.datasetZeroedAccelerationY,
                this.datasetZeroedAccelerationZ,

                this.datasetVelocityX,
                this.datasetVelocityY,
                this.datasetVelocityZ,

            ]
        }
    }

    load(entities: AvionicsDataEntry[]): void {
        this.clearAllDatasets()

        entities.forEach((entry: AvionicsDataEntry) => {

            this.datasetState.data.push({
                x: entry.time,
                y: entry.state
            })

            this.datasetElapsed.data.push({
                x: entry.time,
                y: entry.elapsed
            })

            if (entry.type === AvionicsDataEntryType.Loop) {
                this.loadLoop(entry as AvionicsLoopEntry)
            }

        })
    }

    private loadLoop(entry: AvionicsLoopEntry): void {
        this.datasetRotationX.data.push({
            x: entry.time,
            y: entry.rotationX
        })

        this.datasetRotationY.data.push({
            x: entry.time,
            y: entry.rotationY
        })

        this.datasetRotationZ.data.push({
            x: entry.time,
            y: entry.rotationZ
        })


        this.datasetRawAccelerationX.data.push({
            x: entry.time,
            y: entry.rawAccelerationX
        })

        this.datasetRawAccelerationY.data.push({
            x: entry.time,
            y: entry.rawAccelerationY
        })

        this.datasetRawAccelerationZ.data.push({
            x: entry.time,
            y: entry.rawAccelerationZ
        })


        this.datasetAccelerationX.data.push({
            x: entry.time,
            y: entry.accelerationX
        })

        this.datasetAccelerationY.data.push({
            x: entry.time,
            y: entry.accelerationY
        })

        this.datasetAccelerationZ.data.push({
            x: entry.time,
            y: entry.accelerationZ
        })


        this.datasetWorldAccelerationX.data.push({
            x: entry.time,
            y: entry.worldAccelerationX
        })

        this.datasetWorldAccelerationY.data.push({
            x: entry.time,
            y: entry.worldAccelerationY
        })

        this.datasetWorldAccelerationZ.data.push({
            x: entry.time,
            y: entry.worldAccelerationZ
        })


        this.datasetZeroedAccelerationX.data.push({
            x: entry.time,
            y: entry.zeroedAccelerationX
        })

        this.datasetZeroedAccelerationY.data.push({
            x: entry.time,
            y: entry.zeroedAccelerationY
        })

        this.datasetZeroedAccelerationZ.data.push({
            x: entry.time,
            y: entry.zeroedAccelerationZ
        })


        this.datasetVelocityX.data.push({
            x: entry.time,
            y: entry.velocityX
        })

        this.datasetVelocityY.data.push({
            x: entry.time,
            y: entry.velocityY
        })

        this.datasetVelocityZ.data.push({
            x: entry.time,
            y: entry.velocityZ
        })
    }

    clearAllDatasets(): void {
        this.data.datasets.forEach((dataset: any) => {
            dataset.data = []
        });
    }

    unselectAllDatasets(): void {
        this.data.datasets.forEach((dataset: any) => {
            dataset.hidden = true
        });
    }

}