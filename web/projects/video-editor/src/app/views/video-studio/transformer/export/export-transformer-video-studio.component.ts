import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { VideoExport } from "src/app/services/video-studio/video-export";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-export-transformer',
    templateUrl: './export-transformer-video-studio.component.html'
})
export class ExportTransformerVideoStudioComponent implements OnInit, OnDestroy {

    private static localStorageKey: string = "export-transformer-video-studio-key"

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(
        private readonly videoStudioService: VideoStudioService,
        private readonly localStorageService: LocalStorageService
    ) {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            width: new FormControl(),
            height: new FormControl(),
            filename: new FormControl(),
        })
    }

    private defaultVideoExport(): VideoExport {
        return {
            width: 1920,
            height: 1080,
            filename: 'output.webm'
        }
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription)

        const videoExport: VideoExport = this.localStorageService.getObjectOrDefault(
            ExportTransformerVideoStudioComponent.localStorageKey,
            this.defaultVideoExport()
        )
        this.formGroup.patchValue(videoExport)       
    }

    private getVideoExport(): VideoExport {
        const defaultVideoExport: VideoExport = this.defaultVideoExport()

        const width: number = FormUtils.getValueOrDefault(this.formGroup, "width", defaultVideoExport.width)
        const height: number = FormUtils.getValueOrDefault(this.formGroup, "height", defaultVideoExport.height)
        const filename: string = FormUtils.getValueOrDefault(this.formGroup, "filename", defaultVideoExport.filename)

        return {
            width,
            height,
            filename
        }
    }

    private async onFormChanged(): Promise<void> {
        const videoExport: VideoExport = this.getVideoExport()

        this.localStorageService.updateObject(
            ExportTransformerVideoStudioComponent.localStorageKey,
            videoExport
        )

        await this.videoStudioService.setVideoExport(videoExport)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}