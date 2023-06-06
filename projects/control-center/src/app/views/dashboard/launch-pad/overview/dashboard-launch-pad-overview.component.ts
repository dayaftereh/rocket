import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-launch-pad-overview',
    templateUrl: './dashboard-launch-pad-overview.component.html'
})
export class DashboardLaunchPadOverviewComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

}