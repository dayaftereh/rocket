import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { PreviewTransformerVideoStudioComponent } from "./preview/preview-transformer-video-studio.component";

@Component({
    templateUrl: "./transformer-video-studio.component.html"
})
export class TransformerVideoStudioComponent implements OnDestroy {

    private doneSubscription: Subscription | undefined
    private nextSubscription: Subscription | undefined

    @ViewChild("preview")
    preview: PreviewTransformerVideoStudioComponent | undefined

    constructor(private readonly videoStudioService: VideoStudioService) {

    }

    ngAfterViewInit(): void {

    }

    async onStart(): Promise<void> {
        this.nextSubscription = this.videoStudioService.frameAsObservable().subscribe(async () => {
            await this.videoStudioService.next()
        })

        this.doneSubscription = this.videoStudioService.doneAsObservable().subscribe(async () => {
            this.nextSubscription.unsubscribe()
        })

        await this.videoStudioService.next()
    }

    onPreview(): void {
        if (!this.preview) {
            return
        }

        this.preview.open()
    }

    onCancel(): void {
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