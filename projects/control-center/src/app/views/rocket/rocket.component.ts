import { Component, OnDestroy, OnInit } from "@angular/core";
import { WebRocketConnectionService } from "lrocket";

@Component({
    templateUrl: './rocket.component.html'
})
export class RocketComponent implements OnInit, OnDestroy {

    constructor(
        private readonly webRocketConnectionService: WebRocketConnectionService
    ) {

    }

    async ngOnInit(): Promise<void> {
        this.webRocketConnectionService.connect()
    }

    ngOnDestroy(): void {
        this.webRocketConnectionService.disconnect()
    }

}