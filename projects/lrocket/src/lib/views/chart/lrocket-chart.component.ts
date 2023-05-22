import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { UIChart } from "primeng/chart";
import { LRocketChart } from "./lrocket-chart";

@Component({
    selector: 'lrocket-chart',
    templateUrl: './lrocket-chart.component.html',
})
export class LRocketChartComponent implements OnInit {

    @Input('type')
    type: string

    @Input('height')
    height: string

    @ViewChild('chart')
    chart: UIChart | undefined

    zoomOptions: SelectItem[]

    lrocketChart: LRocketChart | undefined

    constructor() {
        this.type = "line"
        this.height = '45vh'
        this.zoomOptions = []
    }

    @Input("chart")
    set _chart(lrocketChart: LRocketChart | undefined) {
        if (!lrocketChart) {
            return
        }
        this.lrocketChart = lrocketChart
    }

    private get chartZoom(): any | undefined {
        if (!this.lrocketChart || !this.lrocketChart.options || !this.lrocketChart.options.plugins || !this.lrocketChart.options.plugins.zoom || !this.lrocketChart.options.plugins.zoom.zoom) {
            return undefined
        }
        return this.lrocketChart.options.plugins.zoom.zoom
    }

    get zoomMode(): string {
        const zoomOptions: any | undefined = this.chartZoom
        if (!zoomOptions) {
            return "xy"
        }
        return zoomOptions.mode
    }

    set zoomMode(mode: string) {
        const zoomOptions: any | undefined = this.chartZoom
        if (!zoomOptions) {
            return
        }
        zoomOptions.mode = mode
    }

    ngOnInit(): void {
        this.zoomOptions = LRocketChart.zoomModes.map((mode: string) => {
            return {
                value: mode,
                label: mode.toUpperCase()
            }
        })
    }

    resetZoom(): void {
        if (this.chart) {
            this.chart.chart.resetZoom()
        }
    }

    onZoomChanged(): void {
        this.refresh()
    }

    refresh(): void {
        if (this.chart) {
            this.chart.refresh()
        }
    }

}