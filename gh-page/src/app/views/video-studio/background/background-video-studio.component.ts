import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BackgroundSimulation } from "./background-simulation";

@Component({
    templateUrl: "./background-video-studio.component.html"
})
export class BackgroundVideoStudioComponent implements AfterViewInit, OnDestroy {

    @ViewChild("canvas")
    canvas: ElementRef<HTMLCanvasElement> | undefined

    background: BackgroundSimulation | undefined

    constructor() {

    }

    async ngAfterViewInit(): Promise<void> {
        const canvas: HTMLCanvasElement = this.canvas.nativeElement
        this.background = new BackgroundSimulation(canvas)
        await this.background.init()
        this.background.animate()
    }

    ngOnDestroy(): void {
        if (this.background) {
            this.background.destroy()
        }
    }

}