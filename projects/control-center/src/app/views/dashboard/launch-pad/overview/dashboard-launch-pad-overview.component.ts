import { Component, NgZone } from "@angular/core";
import { LaunchPadStatusWebMessage, WebControlCenterConnectionService } from "lrocket";
import { runInZone } from "projects/lrocket/src/lib/utils/rxjs-ngzone";
import { Observable } from "rxjs";

@Component({
    selector: 'app-dashboard-launch-pad-overview',
    templateUrl: './dashboard-launch-pad-overview.component.html'
})
export class DashboardLaunchPadOverviewComponent {

    status$: Observable<LaunchPadStatusWebMessage>

    constructor(
        private readonly ngZone: NgZone,
        private readonly webControlCenterConnectionService: WebControlCenterConnectionService,
    ) {
        this.status$ = this.webControlCenterConnectionService.launchPadStatus().pipe(
            runInZone(this.ngZone),
        )
    }

}