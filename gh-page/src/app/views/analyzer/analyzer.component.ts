import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UIChart } from "primeng/chart";
import { Subscription } from "rxjs";
import { AnalyzerChart } from "./analyzer-chart";
import { AvionicsDataEntry } from "./avionics-data-entry";
import { AvionicsDataLoader } from "./avionics-data-loader";

@Component({
    templateUrl: './analyzer.component.html'
})
export class AnalyzerComponent implements OnInit, OnDestroy {

    analyzerChart: AnalyzerChart

    @ViewChild('chart')
    chart: UIChart | undefined

    private subscriptions: Subscription[]

    constructor() {
        this.subscriptions = []
        this.analyzerChart = new AnalyzerChart()
    }

    ngOnInit(): void {
        this.analyzerChart.init()
    }

    async onUpload(event: any): Promise<void> {
        if (!event || !event.files || event.files.length < 1) {
            return
        }
        const file: File = event.files[0]

        const loader: AvionicsDataLoader = new AvionicsDataLoader()
        const entities: AvionicsDataEntry[] = await loader.load(file)
        this.analyzerChart.load(entities)

        // reload the chart
        if (this.chart) {
            this.chart.refresh()
        }
    }

    onResetChart(): void {
        if (!this.chart || !this.chart.chart) {
            return
        }
        this.chart.chart.resetZoom()
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }
}