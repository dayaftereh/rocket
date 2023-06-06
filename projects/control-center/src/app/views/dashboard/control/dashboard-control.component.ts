import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-control',
    templateUrl: './dashboard-control.component.html',
})
export class DashboardControlComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

    onStart(): void {
        this.webControlCenterConnectionService.start()
    }

    onAbort(): void {
        this.webControlCenterConnectionService.abort()
    }

}