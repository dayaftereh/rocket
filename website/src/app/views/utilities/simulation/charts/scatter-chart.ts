export class ScatterChart {

    data: any
    options: any

    constructor(private dataset0Name: string, private xAxesLabel: string) {
        this.init()
    }

    update0(data: any[]): any {
        this.data = {
            datasets: [{
                data,
                fill: false,
                borderColor: 'rgb(255,0,0)',
                backgroundColor: 'rgb(255,0,0)',
                label: this.dataset0Name,
                lineTension: 0,
                showLine: true,
                pointRadius: 0,
            }]
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
                xAxes: [{
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
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#ebedef'
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.xAxesLabel
                    }
                }]
            }
        }
    }

}