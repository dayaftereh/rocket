import { Component } from "@angular/core";
import { WebRocketConnectionService } from "lrocket";

@Component({
    selector: 'app-rocket-status',
    templateUrl: './rocket-status.component.html'
})
export class RocketStatusComponent {

    constructor(
        private readonly webRocketConnectionService: WebRocketConnectionService
    ) {

    }

}