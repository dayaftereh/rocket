import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-rocket-control',
    templateUrl: './dashboard-rocket-control.component.html',
})
export class DashboardRocketControlComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

    onOpenParachute(): void {
        this.webControlCenterConnectionService.openParachute()
    }

    onCloseParachute(): void {
        this.webControlCenterConnectionService.closeParachute()
    }

}