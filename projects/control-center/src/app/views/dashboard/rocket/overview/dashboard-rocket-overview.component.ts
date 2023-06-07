import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-rocket-overview',
    templateUrl: './dashboard-rocket-overview.component.html'
})
export class DashboardRocketOverviewComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

}