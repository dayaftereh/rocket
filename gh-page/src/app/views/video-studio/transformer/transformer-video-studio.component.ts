import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";

@Component({
    templateUrl: "./transformer-video-studio.component.html"
})
export class TransformerVideoStudioComponent implements OnDestroy {

    private doneSubscription: Subscription | undefined
    private nextSubscription: Subscription | undefined

    constructor(private readonly videoStudioService: VideoStudioService) {

    }

    ngAfterViewInit(): void {

    }

    async start(): Promise<void> {
        this.videoStudioService.initialize({
            frameRate: 30,
            frameDuration: undefined,
            width: 1920,
            height: 1080
        })

        this.nextSubscription = this.videoStudioService.frameAsObservable().subscribe(async () => {
            await this.videoStudioService.next()
        })

        this.doneSubscription = this.videoStudioService.doneAsObservable().subscribe(async () => {
            this.nextSubscription.unsubscribe()
        })

        await this.videoStudioService.next()
    }

    cancel(): void {
        this.videoStudioService.cancel()
    }

    ngOnDestroy(): void {
        if (this.nextSubscription) {
            this.nextSubscription.unsubscribe()
        }

        if (this.doneSubscription) {
            this.doneSubscription.unsubscribe()
        }
    }
}