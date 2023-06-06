import { Component } from "@angular/core";
import { WebControlCenterConnectionService } from "lrocket";

@Component({
    selector: 'app-dashboard-launch-pad-pressure',
    templateUrl: './dashboard-launch-pad-pressure.component.html'
})
export class DashboardLaunchPadPressureComponent {

    constructor(
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {

    }

}