import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { fromEvent, Subscription } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { FormUtils } from "src/app/utils/form-utils";
import { MediaTransformerVideoStudioOptions } from "./media-transformer-video-studio-options";

@Component({
    selector: 'app-media-transformer',
    templateUrl: "./media-transformer-video-studio.component.html"
})
export class MediaTransformerVideoStudioComponent implements OnInit, AfterViewInit, OnDestroy {

    private static localStorageKey: string = "media-transformer-video-studio-key"

    @ViewChild("videoParent")
    videoParent: ElementRef<HTMLElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    time: number
    frames: number
    duration: number

    sliderTime: number

    seekTime: number = 1.0 / 60.0
    seekTimes: SelectItem[]

    loaded: boolean

    formGroup: FormGroup

    private epsilon: number = 0.0001

    private subscriptions: Subscription[]

    constructor(
        private readonly videoStudioService: VideoStudioService,
        private readonly localStorageService: LocalStorageService) {
        this.time = 0
        this.frames = 0
        this.duration = 0
        this.sliderTime = 0
        this.loaded = false
        this.seekTimes = []
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            frameDuration: new FormControl(),
            dx: new FormControl(),
            dy: new FormControl(),
            width: new FormControl(),
            height: new FormControl(),
            offsetX: new FormControl(),
            offsetY: new FormControl(),
        })
    }

    private defaultOptions(): MediaTransformerVideoStudioOptions {
        return {
            dx: 0,
            dy: 0,
            frameDuration: 1 / 60,
            width: 1920,
            height: 1080,
            offsetX: 0,
            offsetY: 0
        }
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        const options: MediaTransformerVideoStudioOptions = this.localStorageService.getObjectOrDefault(
            MediaTransformerVideoStudioComponent.localStorageKey,
            this.defaultOptions()
        )
        this.formGroup.patchValue(options)

        const nextSubscription: Subscription = this.videoStudioService.nextAsObservable().subscribe(async () => {
            await this.onNext()
        })

        this.subscriptions.push(formSubscription, nextSubscription)

        this.seekTimes.push(
            {
                value: 1 / 15.0,
                label: "15 FPS"
            },
            {
                value: 1 / 30.0,
                label: "30 FPS"
            },
            {
                value: 1 / 50.0,
                label: "50 FPS"
            },
            {
                value: 1 / 60.0,
                label: "60 FPS"
            },
            {
                value: 1 / 120.0,
                label: "120 FPS"
            },
        )



        this.setFormEnabled(false)
    }

    ngAfterViewInit(): void {
        const video: HTMLVideoElement = this.videoElement.nativeElement

        // event for time updated
        const timeupdateSubscription: Subscription = fromEvent(video, "timeupdate").subscribe(async () => {
            await this.onTimeUpdate()
        })

        // event for loaded video
        const loadedSubscription: Subscription = fromEvent(video, "loadeddata").subscribe(() => {
            this.onLoadedData()
        })

        this.subscriptions.push(timeupdateSubscription, loadedSubscription)

        // trigger resize once
        this.onResize()
    }

    onFile(event: any): void {
        if (!event || !event.files || event.files.length < 1) {
            return
        }

        const file: File = event.files[0]
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.src = URL.createObjectURL(file)
    }

    onSlideEnd(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.max(0.0, Math.min(element.duration, this.sliderTime))
        const frames: number = Math.round(element.currentTime * (1.0 / this.seekTime)) - 1.0
        this.frames = Math.max(0, Math.min(element.duration * (1.0 / this.seekTime), frames))
    }

    @HostListener('window:resize')
    onResize(): void {
        const parent: HTMLElement = this.videoParent.nativeElement
        const video: HTMLVideoElement = this.videoElement.nativeElement

        video.width = 0
        video.height = 0

        video.width = parent.clientWidth * 0.95
        video.height = video.width * 9 / 16
    }

    private async onTimeUpdate(): Promise<void> {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        const delta: number = video.currentTime - this.time
        this.time = video.currentTime

        if (delta > 0.0) {
            this.frames++
        } else if (delta < 0.0) {
            this.frames = Math.max(0, this.frames--)
        }

        this.frames = Math.max(0, Math.min(video.duration * (1.0 / this.seekTime), this.frames))

        await this.renderFrame()
    }

    private async renderFrame(): Promise<void> {
        // get the video element
        const video: HTMLVideoElement = this.videoElement.nativeElement

        // @ts-ignore
        const bufCanvas: any = new OffscreenCanvas(video.videoWidth, video.videoHeight)
        const bufContext2D: CanvasRenderingContext2D = bufCanvas.getContext("2d")

        // get the options for dy, dy and width, height
        const options: MediaTransformerVideoStudioOptions = this.getOptions()
        // draw the current video to the buffer canvas        
        bufContext2D.drawImage(video, options.dx, options.dy, options.width, options.height)

        // get the image data from the buffer canvas
        const frame: ImageData = bufContext2D.getImageData(0, 0, video.videoWidth, video.videoHeight)
        // set the next frame to worker
        await this.videoStudioService.setFrame({
            time: this.time,
            data: frame.data,
            counter: this.frames,
            width: video.videoWidth,
            height: video.videoHeight,
        })
    }

    private onLoadedData(): void {
        this.frames = 0
        this.loaded = true
        this.setFormEnabled(true)

        const video: HTMLVideoElement = this.videoElement.nativeElement

        this.time = video.currentTime
        this.duration = video.duration

        setTimeout(() => {
            this.renderFrame().catch((e: Error) => {
                console.error(e)
            })
        }, 100)
    }

    private async onNext(): Promise<void> {
        const element: HTMLVideoElement = this.videoElement.nativeElement

        if (Math.abs(element.currentTime - element.duration) < this.epsilon) {
            element.currentTime = element.duration
            await this.videoStudioService.done()
            return
        }

        this.next()
    }

    async onFormChanged(): Promise<void> {
        const options: MediaTransformerVideoStudioOptions = this.getOptions()
        this.seekTime = options.frameDuration

        this.localStorageService.updateObject(
            MediaTransformerVideoStudioComponent.localStorageKey,
            options
        )

        await this.videoStudioService.setVideoMeta({
            frameDuration: options.frameDuration,
            x: options.offsetX,
            y: options.offsetY
        })

    }

    private getOptions(): MediaTransformerVideoStudioOptions {
        const defaultOptions: MediaTransformerVideoStudioOptions = this.defaultOptions()

        const frameDuration: number = FormUtils.getValueOrDefault(this.formGroup, "frameDuration", defaultOptions.frameDuration)

        const dx: number = FormUtils.getValueOrDefault(this.formGroup, "dx", defaultOptions.dx)
        const dy: number = FormUtils.getValueOrDefault(this.formGroup, "dy", defaultOptions.dy)

        const offsetX: number = FormUtils.getValueOrDefault(this.formGroup, "offsetX", defaultOptions.offsetX)
        const offsetY: number = FormUtils.getValueOrDefault(this.formGroup, "offsetY", defaultOptions.offsetY)

        const width: number = FormUtils.getValueOrDefault(this.formGroup, "width", defaultOptions.width)
        const height: number = FormUtils.getValueOrDefault(this.formGroup, "height", defaultOptions.height)

        return {
            frameDuration,
            dx,
            dy,
            offsetX,
            offsetY,
            width,
            height
        }
    }

    private setFormEnabled(flag: boolean): void {
        FormUtils.setControlEnable(this.formGroup, "frameDuration", flag)
        FormUtils.setControlEnable(this.formGroup, "dx", flag)
        FormUtils.setControlEnable(this.formGroup, "dy", flag)
        FormUtils.setControlEnable(this.formGroup, "width", flag)
        FormUtils.setControlEnable(this.formGroup, "height", flag)
        FormUtils.setControlEnable(this.formGroup, "offsetX", flag)
        FormUtils.setControlEnable(this.formGroup, "offsetY", flag)
    }

    next(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.min(element.duration, element.currentTime + this.seekTime)
        this.sliderTime = element.currentTime
    }

    previous(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.max(0.0, element.currentTime - this.seekTime)
        this.sliderTime = element.currentTime
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}