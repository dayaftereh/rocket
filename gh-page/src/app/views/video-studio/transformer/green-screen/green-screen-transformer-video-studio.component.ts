import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { Subscription } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { VideoGreenScreenMode } from "src/app/services/video-studio/video-green-screen-mode";
import { VideoGreenScreenOptions } from "src/app/services/video-studio/video-green-screen-options";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-green-screen-transformer',
    templateUrl: './green-screen-transformer-video-studio.component.html'
})
export class GreenScreenTransformerVideoStudioComponent implements OnInit, OnDestroy {

    private static localStorageKey: string = "green-screen-transformer-video-studio-key"

    formGroup: FormGroup

    modes: SelectItem[]

    @ViewChild("overlay")
    overlay: OverlayPanel | undefined

    @ViewChild("canvas")
    canvas: ElementRef<HTMLCanvasElement> | undefined

    private subscriptions: Subscription[]

    constructor(
        private readonly videoStudioService: VideoStudioService,
        private readonly localStorageService: LocalStorageService) {
        this.modes = []
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            mode: new FormControl(),
            key: new FormControl(),
            enabled: new FormControl(),
            hueThreshold: new FormControl(),
            satThreshold: new FormControl(),
            valThreshold: new FormControl(),
            channelThreshold: new FormControl(),
        })
    }

    private defaultVideoGreenScreenOptions(): VideoGreenScreenOptions {
        return {
            enabled: false,
            key: "#000000",
            channelThreshold: 126,
            hueThreshold: 0.5,
            satThreshold: 0.5,
            mode: VideoGreenScreenMode.KeyColor,
            valThreshold: 0.5,
        }
    }

    ngOnInit(): void {
        this.modes.push(
            {
                value: VideoGreenScreenMode.KeyColor,
                label: `${VideoGreenScreenMode.KeyColor}`
            },
            {
                value: VideoGreenScreenMode.ChannelRed,
                label: `${VideoGreenScreenMode.ChannelRed}`
            },
            {
                value: VideoGreenScreenMode.ChannelGreen,
                label: `${VideoGreenScreenMode.ChannelGreen}`
            },
            {
                value: VideoGreenScreenMode.ChannelBlue,
                label: `${VideoGreenScreenMode.ChannelBlue}`
            }
        )
       
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })
        this.subscriptions.push(formSubscription)

        const options: VideoGreenScreenOptions = this.localStorageService.getObjectOrDefault(
            GreenScreenTransformerVideoStudioComponent.localStorageKey,
            this.defaultVideoGreenScreenOptions()
        )
        this.formGroup.patchValue(options)
    }

    private onFormChanged(): void {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)

        const opts: any = {
            emitEvent: false
        }

        FormUtils.setControlEnable(this.formGroup, 'mode', enabled, opts)
        const mode: VideoGreenScreenMode = FormUtils.getValueOrDefault(this.formGroup, "mode", VideoGreenScreenMode.KeyColor)

        const keyColor: boolean = mode === VideoGreenScreenMode.KeyColor
        FormUtils.setControlEnable(this.formGroup, 'key', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'hueThreshold', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'satThreshold', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'valThreshold', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'channelThreshold', enabled && !keyColor, opts)

        const options: VideoGreenScreenOptions = this.getOptions()
        this.localStorageService.updateObject(
            GreenScreenTransformerVideoStudioComponent.localStorageKey,
            options
        )

        this.videoStudioService.setGreenScreen(options)
    }

    private getOptions(): VideoGreenScreenOptions {
        const defaultOptions: VideoGreenScreenOptions = this.defaultVideoGreenScreenOptions()

        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", defaultOptions.enabled)

        const mode: VideoGreenScreenMode = FormUtils.getValueOrDefault(this.formGroup, "mode", defaultOptions.mode)

        const key: string = FormUtils.getValueOrDefault(this.formGroup, "key", defaultOptions.key)

        const hueThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "hueThreshold", defaultOptions.hueThreshold)
        const satThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "satThreshold", defaultOptions.satThreshold)
        const valThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "valThreshold", defaultOptions.valThreshold)

        const channelThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "channelThreshold", defaultOptions.channelThreshold)

        return {
            key,
            mode,
            enabled,
            hueThreshold,
            satThreshold,
            valThreshold,
            channelThreshold,
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}