import { Component, OnDestroy, OnInit } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

    async ngOnInit(): Promise<void> {
        await this.webControlCenterConnectionService.connect()
    }

    async ngOnDestroy(): Promise<void> {
        await this.webControlCenterConnectionService.disconnect()
    }

}