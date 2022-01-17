import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FileUpload } from "primeng/fileupload";
import { Subscription } from "rxjs";
import { FormUtils } from "src/app/utils/form-utils";
import { GreenScreen } from "./green-screen";
import { GreenScreenOptions } from "./green-screen-options";

@Component({
    templateUrl: './green-screen-video-studio.component.html'
})
export class GreenScreenVideoStudioComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("fileUpload")
    fileUpload: FileUpload | undefined

    @ViewChild("canvas")
    canvasElement: ElementRef<HTMLCanvasElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    formGroup: FormGroup

    private greenScreen: GreenScreen | undefined

    private subscriptions: Subscription[]

    constructor() {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        const options: GreenScreenOptions = this.defaultOptions()
        return new FormGroup({
            color: new FormControl(options.key),
            useChannel: new FormControl(options.useChannel),
            hueThreshold: new FormControl(options.hueThreshold),
            satThreshold: new FormControl(options.satThreshold),
            valThreshold: new FormControl(options.valThreshold),
            channelThreshold: new FormControl(options.channelThreshold),
        })
    }

    private defaultOptions(): GreenScreenOptions {
        return {
            useChannel: false,
            hueThreshold: 0.1,
            satThreshold: 0.1,
            valThreshold: 0.1,
            channelThreshold: 10.0,
            key: {
                r: 14.0, g: 255.0, b: 0.0
            }
        }
    }

    onVideo(event: any): void {
        if (!event || !event.files || event.files.length < 1) {
            return
        }

        if (!this.videoElement) {
            return
        }

        const first: File = event.files[0]
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.src = URL.createObjectURL(first)

        if (this.fileUpload) {
            this.fileUpload.clear()
        }
    }

    ngOnInit(): void {
        const subscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(subscription)
    }

    async ngAfterViewInit(): Promise<void> {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        const canvas: HTMLCanvasElement = this.canvasElement.nativeElement

        this.greenScreen = new GreenScreen(video, canvas)
        await this.greenScreen.init()

        const options: GreenScreenOptions = this.getGreenScreenOptions()
        this.greenScreen.changeOptions(options, false)
    }

    private onFormChanged(): void {
        const options: GreenScreenOptions = this.getGreenScreenOptions()
        if (this.greenScreen) {
            this.greenScreen.changeOptions(options, true)
        }
    }

    private getGreenScreenOptions(): GreenScreenOptions {
        const defaultOptions: GreenScreenOptions = this.defaultOptions()
        const useChannel: boolean = FormUtils.getValueOrDefault(this.formGroup, "useChannel", defaultOptions.useChannel)
        const hueThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "hueThreshold", defaultOptions.hueThreshold)
        const satThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "satThreshold", defaultOptions.satThreshold)
        const valThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "valThreshold", defaultOptions.valThreshold)
        const channelThreshold: number = FormUtils.getValueOrDefault(this.formGroup, "channelThreshold", defaultOptions.channelThreshold)
        const key: any = FormUtils.getValueOrDefault(this.formGroup, "color", { r: 0.0, g: 255.0, b: 0.0 })

        return {
            key,
            useChannel,
            hueThreshold,
            satThreshold,
            valThreshold,
            channelThreshold,
        }
    }

    ngOnDestroy(): void {
        if (this.greenScreen) {
            this.greenScreen.destroy()
        }

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}