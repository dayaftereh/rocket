import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { Subscription } from "rxjs";
import { VideoFrame } from "src/app/services/video-studio/video-frame";
import { VideoGreenScreenMode } from "src/app/services/video-studio/video-green-screen-mode";
import { VideoGreenScreenOptions } from "src/app/services/video-studio/video-green-screen-options";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { Color } from "src/app/utils/color";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-green-screen-transformer',
    templateUrl: './green-screen-transformer-video-studio.component.html'
})
export class GreenScreenTransformerVideoStudioComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    modes: SelectItem[]

    @ViewChild("overlay")
    overlay: OverlayPanel | undefined

    @ViewChild("canvas")
    canvas: ElementRef<HTMLCanvasElement> | undefined

    private subscriptions: Subscription[]

    constructor(private readonly videoStudioService: VideoStudioService) {
        this.modes = []
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            mode: new FormControl(),
            color: new FormControl(),
            enabled: new FormControl(),
            hueThreshold: new FormControl(),
            satThreshold: new FormControl(),
            valThreshold: new FormControl(),
            channelThreshold: new FormControl(),
        })
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

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

        this.subscriptions.push(formSubscription)

        // trigger form changed
        this.onFormChanged()
    }

    private onFormChanged(): void {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)

        const opts: any = {
            emitEvent: false
        }

        FormUtils.setControlEnable(this.formGroup, 'mode', enabled, opts)
        const mode: VideoGreenScreenMode = FormUtils.getValueOrDefault(this.formGroup, "mode", VideoGreenScreenMode.KeyColor)

        const keyColor: boolean = mode === VideoGreenScreenMode.KeyColor
        FormUtils.setControlEnable(this.formGroup, 'color', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'hueThreshold', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'satThreshold', enabled && keyColor, opts)
        FormUtils.setControlEnable(this.formGroup, 'valThreshold', enabled && keyColor, opts)

        FormUtils.setControlEnable(this.formGroup, 'channelThreshold', enabled && !keyColor, opts)

        const options: VideoGreenScreenOptions | undefined = this.getOptions()
        this.videoStudioService.setGreenScreen(options)
    }

    private getOptions(): VideoGreenScreenOptions | undefined {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)
        if (!enabled) {
            return undefined
        }

        const mode: VideoGreenScreenMode = FormUtils.getValueOrDefault(this.formGroup, "mode", VideoGreenScreenMode.KeyColor)

        const color: string = FormUtils.getValueOrDefault(this.formGroup, "color", "#000000")

        const hueThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "hueThreshold", 0.5)
        const satThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "satThreshold", 0.5)
        const valThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "valThreshold", 0.5)

        const channelThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "channelThreshold", 0.0)

        return {
            mode,
            hueThreshold,
            satThreshold,
            valThreshold,
            channelThreshold,
            key: Color.hexToRgb(color)
        }
    }

    async onShow(): Promise<void> {
        console.log(this.canvas)
        if (!this.canvas) {
            return
        }

        const frame: VideoFrame | undefined = await this.videoStudioService.greenScreen()
        if (!frame) {
            return
        }

        //@ts-ignore
        const buf: any = new OffscreenCanvas(frame.width, frame.height)
        const bufContext: CanvasRenderingContext2D = buf.getContext("2d")
        const image: ImageData = bufContext.createImageData(frame.width, frame.height)
        for (let i = 0; i < frame.data.length; i++) {
            image.data[i] = frame.data[i]
        }
        bufContext.putImageData(image, 0, 0)

        const w: number = 500
        const max: number = Math.max(frame.width, frame.height)

        let scale: number = 1
        if (max > 500) {
            scale = w / max
        }

        const canvas: HTMLCanvasElement = this.canvas.nativeElement
        const context: CanvasRenderingContext2D = canvas.getContext("2d")

        canvas.width = frame.width * scale
        canvas.height = frame.height * scale

        context.scale(scale, scale)
        context.drawImage(buf, 0, 0)
    }

    async snapshot(event: any): Promise<void> {
        if (!this.overlay) {
            return
        }

        this.overlay.show(event)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}