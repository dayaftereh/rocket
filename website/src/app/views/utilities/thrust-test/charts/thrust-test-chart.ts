import { SerialReading } from "../serial/serial-reading"

export class ThrustTestChart {

    data: any
    options: any

    constructor() {
        this.init()
    }

    update(readings: SerialReading[]): void {

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
        })

        this.data = {
            datasets: [
                {
                    data: thrust,
                    fill: false,
                    borderColor: 'rgb(255,0,0)',
                    backgroundColor: 'rgb(255,0,0)',
                    label: 'Thrust',
                    lineTension: 0,
                    showLine: true,
                    pointRadius: 0,
                    xAxisID: 'default-x-axis',
                    yAxisID: 'thrust-y-axis'
                },
                {
                    data: pressure,
                    fill: false,
                    borderColor: 'rgb(0,255,0)',
                    backgroundColor: 'rgb(0,255,0)',
                    label: 'Pressure',
                    lineTension: 0,
                    showLine: true,
                    pointRadius: 0,
                    xAxisID: 'default-x-axis',
                    yAxisID: 'pressure-y-axis'
                }
            ]
        }

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
                    {
                        id: 'default-x-axis',
                        ticks: {
                            fontColor: '#ebedef'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.2)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Time (s)'
                        }
                    }
                ],
                yAxes: [
                    {
                        id: 'thrust-y-axis',
                        ticks: {
                            fontColor: '#ebedef'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.2)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'N'
                        }

                    },
                    {
                        id: 'pressure-y-axis',
                        position: 'right',
                        ticks: {
                            fontColor: '#ebedef'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.2)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'bar'
                        }

                    }
                ]
            }
        }
    }
}