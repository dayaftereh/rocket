import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LRocketChartComponent, LaunchPadConfigWebMessage, LaunchPadStatusWebMessage, WebControlCenterConnectionService } from "lrocket";
import { DashboardLaunchPadPressureChart } from "./dashboard-launch-pad-pressure-chart";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-dashboard-launch-pad-pressure',
    templateUrl: './dashboard-launch-pad-pressure.component.html'
})
export class DashboardLaunchPadPressureComponent implements OnInit, OnDestroy {

    pressureChart: DashboardLaunchPadPressureChart

    @ViewChild('chart')
    chart: LRocketChartComponent | undefined

    private subscriptions: Subscription[]

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {
        this.subscriptions = []
        this.pressureChart = new DashboardLaunchPadPressureChart()
    }

    ngOnInit(): void {
        this.pressureChart.init()

        const statusSubscription: Subscription = this.webControlCenterConnectionService.launchPadStatus().subscribe((status: LaunchPadStatusWebMessage) => {
            this.onStatus(status)
        })

        const configSubscription: Subscription = this.webControlCenterConnectionService.launchPadConfig().subscribe((config: LaunchPadConfigWebMessage) => {
            this.onConfig(config)
        })
        this.subscriptions.push(statusSubscription, configSubscription)
    }

    private onStatus(status: LaunchPadStatusWebMessage): void {
        this.pressureChart.onPressure(status.pressure)
    }

    private onConfig(config: LaunchPadConfigWebMessage): void {
        this.pressureChart.onConfig(config)

        if (this.chart) {
            this.chart.refresh()
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}