import { LRocketChart, LaunchPadConfigWebMessage } from "lrocket";

export class DashboardLaunchPadPressureChart extends LRocketChart {

    protected xAxisId: string = 'x-axis-0'
    protected yAxisId: string = 'y-axis-0'

    private pressure: any
    private abortPressureAnnotation: any
    private targetPressureAnnotation: any

    constructor() {
        super()
    }

    init(): void {
        const scales: any = {}

        // setup y
        scales[this.yAxisId] = this.createLinearAxis("y", 'bar')

        scales[this.xAxisId] = this.createRealtimeAxis("x", 40 * 1000)
        scales[this.xAxisId].time.unit = "second"
        scales[this.xAxisId].realtime.delay = 0

        this.options = this.createDefaultOptions({
            scales,
            interaction: {
                intersect: false
            }
        })

        this.options = this.injectZoom(this.options, 'xy', 'y')
        this.plugins = this.createDefaultPlugins()

        this.abortPressureAnnotation = this.createYLineAnnotation('#f00', undefined, this.xAxisId, this.yAxisId)
        this.targetPressureAnnotation = this.createYLineAnnotation('#0f0', undefined, this.xAxisId, this.yAxisId)
        this.options = this.injectAnnotations(this.options, {
            abort: this.abortPressureAnnotation,
            target: this.targetPressureAnnotation,
        })

        this.pressure = this.createDataset('pressure', '#00f', this.xAxisId, this.yAxisId)

        this.data = {
            datasets: [
                this.pressure,
            ]
        }
    }

    protected createYLineAnnotation(color: string, label?: string, xAxisID?: string, yAxisID?: string) {
        const annotation: any = this.createLineAnnotation(color, label, xAxisID, yAxisID)
        annotation.xMin = undefined
        annotation.xMax = undefined

        annotation.yMin = 0
        annotation.yMax = 0

        annotation.borderWidth = 2

        return annotation
    }

    onPressure(pressure: number): void {
        this.pressure.data.push({
            x: new Date(),
            y: pressure,
        })
    }

    onConfig(message: LaunchPadConfigWebMessage): void {
        message.targetPressure
    }
}