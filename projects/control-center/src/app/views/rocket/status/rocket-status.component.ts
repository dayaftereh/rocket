import { Component } from "@angular/core";
import { RocketStatusWebMessage, WebRocketConnectionService } from "lrocket";
import { RocketService } from "../../../services/rocket/rocket.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-rocket-status',
    templateUrl: './rocket-status.component.html'
})
export class RocketStatusComponent {

    status$: Observable<RocketStatusWebMessage>

    constructor(
        private readonly rocketService: RocketService,
    ) {
        this.status$ = this.rocketService.statusAsObservable()
    }

}