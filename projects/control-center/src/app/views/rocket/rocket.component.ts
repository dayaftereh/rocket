import { Component, OnDestroy, OnInit } from "@angular/core";
import { RocketService } from "../../services/rocket/rocket.service";

@Component({
    templateUrl: './rocket.component.html'
})
export class RocketComponent implements OnInit, OnDestroy {

    constructor(
        private readonly rocketService: RocketService
    ) {

    }

    async ngOnInit(): Promise<void> {
        await this.rocketService.start()
    }

    async ngOnDestroy(): Promise<void> {
        this.rocketService.stop()
    }

}