import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-rocket-orientation',
    templateUrl: './dashboard-rocket-orientation.component.html'
})
export class DashboardRocketOrientationComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

}