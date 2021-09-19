import { SerialReading } from "../serial/serial-reading"

export class ThrustTestChart {

    data: any
    options: any

    private readingsDatasets: any[]
    private simulationModelDatasets: any[]

    constructor() {
        this.init()
        this.readingsDatasets = []
        this.simulationModelDatasets = []
    }

    update(readings: SerialReading[]): void {

        const valve: any[] = []
        const thrust: any[] = []
        const pressure: any[] = []

        readings.forEach((reading: SerialReading) => {
            const time: number = reading.time / 1000.0

            thrust.push({
                x: time,
                y: reading.thrust
            })

            pressure.push({
                x: time,
                y: reading.pressure
            })

            valve.push({
                x: time,
                y: reading.valve ? 1 : 0
            })
        })

        this.readingsDatasets = [
            this.defaultDataset({
                data: thrust,
                label: 'Thrust',
                yAxisID: 'thrust-y-axis'
            }, 'rgb(255, 0, 0)'),
            this.defaultDataset({
                data: pressure,
                label: 'Pressure',
                yAxisID: 'pressure-y-axis'
            }, 'rgb(0, 255, 0)'),
            this.defaultDataset({
                data: valve,
                label: 'Valve',
                yAxisID: 'valve-y-axis'
            }, 'rgb(0, 0, 255)'),
        ]

        this.updateDatasets()
    }

    simulationModel(pressure: any[], thrust: any[]): void {
        this.simulationModelDatasets = [
            this.defaultDataset({
                data: thrust,
                label: 'SimThrust',
                yAxisID: 'thrust-y-axis'
            }, 'rgb(255, 0, 255)'),
            this.defaultDataset({
                data: pressure,
                label: 'SimPressure',
                yAxisID: 'pressure-y-axis'
            }, 'rgb(0, 255, 255)'),
        ]

        this.updateDatasets()
    }

    private updateDatasets(): void {
        this.data = {
            datasets: [
                ...this.readingsDatasets,
                ...this.simulationModelDatasets
            ]
        }
    }

    private defaultDataset(parent: any, color: string): any {
        return Object.assign({
            fill: false,
            borderColor: color,
            backgroundColor: color,
            lineTension: 0,
            showLine: true,
            pointRadius: 0,
            xAxisID: 'default-x-axis',
        }, parent)
    }

    private defaultAxis(parent: any): any {
        return Object.assign({
            ticks: {
                fontColor: '#ebedef'
            },
            gridLines: {
                color: 'rgba(255,255,255,0.2)'
            }
        }, parent)
    }

    private init(): void {
        this.options = {
            legend: {
                labels: {
                    fontColor: '#ebedef'
                }
            },
            scales: {
                xAxes: [
                    this.defaultAxis({
                        id: 'default-x-axis',
                        scaleLabel: {
                            display: true,
                            labelString: 'Time (s)'
                        }
                    }),
                ],
                yAxes: [
                    this.defaultAxis({
                        id: 'thrust-y-axis',
                        position: 'right',
                        scaleLabel: {
                            display: true,
                            labelString: 'Newton'
                        }
                    }),
                    this.defaultAxis({
                        id: 'pressure-y-axis',
                        scaleLabel: {
                            display: true,
                            labelString: 'Bar'
                        }
                    }),
                    this.defaultAxis({
                        position: 'right',
                        id: 'valve-y-axis',
                    }),
                ]
            }
        }
    }
}