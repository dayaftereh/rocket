export class Chart {

    public data: any
    public options: any
    public plugins: any

    private fontSize: number = 12

    constructor() {
        this.data = {}
        this.options = {}
        this.plugins = {}
    }

    protected createDataset(label: string, color?: string, xAxisId?: string, yAxisId?: string): any {
        return {
            label,
            data: [],
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: 3.0,
            pointRadius: 0,
            borderColor: color,
            xAxisID: xAxisId,
            yAxisID: yAxisId,
        }
    }

    protected get labelFont(): string {
        return '#ebedef'
    }

    protected createLinearAxis(axis: string): any {
        return {
            axis,
            type: 'linear',
            stacked: false,
            ticks: {
                sampleSize: 5,
                color: '#ebedef',
                font: {
                    size: this.fontSize
                }
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        }
    }

    protected createDefaultPlugins(): any {
        return {
            autocolors: false,
        }
    }

    protected createDefaultOptions(parent: any): any {
        return Object.assign({}, {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: this.fontSize
                        },
                        color: '#ebedef',
                    }
                }
            },
            animation: false,
        }, parent)
    }

    protected createRealtimeAxis(axis: string, duration: number): any {
        const baseAxis: any = this.createLinearAxis(axis)
        baseAxis.type = 'realtime'

        baseAxis.time = {
            displayFormats: {
                second: 'hh:mm:ss',
                minute: 'hh:mm:ss',
                hour: 'hh:mm:ss',
            }
        }

        baseAxis.ticks.source = 10.0
        baseAxis.ticks.maxRotation = 0.0
        baseAxis.ticks.autoSkipPadding = 10.0

        baseAxis.realtime = {
            duration,
            delay: 0,
            refresh: 500,
            frameRate: 25,
            ttl: duration,
        }

        return baseAxis
    }


}