import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";

@Component({
    selector: 'app-media-transformer',
    templateUrl: "./media-transformer-video-studio.component.html"
})
export class MediaTransformerVideoStudioComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("parent")
    parent: ElementRef<HTMLElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    time: number
    frames: number
    duration: number

    seekTime: number = 1.0 / 60.0

    loaded: boolean

    private bufCanvas: any | undefined
    private bufContext2D: CanvasRenderingContext2D | undefined

    private subscriptions: Subscription[]

    constructor(private readonly videoStudioService: VideoStudioService) {
        this.time = 0
        this.frames = 0
        this.loaded = false
        this.subscriptions = []
    }

    ngOnInit(): void {
        const subscription: Subscription = this.videoStudioService.nextAsObservable().subscribe(() => {
            this.onNext()
        })

        this.subscriptions.push(subscription)
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


        // register for the parent element
        const parent: HTMLElement = this.parent.nativeElement
        const resizeSubscription: Subscription = fromEvent(parent, "resize").subscribe(() => {
            this.onResize()
        })

        this.subscriptions.push(timeupdateSubscription, loadedSubscription, resizeSubscription)

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

    private onResize(): void {
        const parent: HTMLElement = this.parent.nativeElement
        const video: HTMLVideoElement = this.videoElement.nativeElement

        video.width = parent.clientWidth * 0.95
        video.height = parent.clientHeight
    }

    private async onTimeUpdate(): Promise<void> {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        const delta: number = video.currentTime - this.time
        this.time = video.currentTime

        if (delta > 0.0) {
            this.frames++
        } else if (delta < 0.0) {
            this.frames--
        }

        await this.renderFrame()
    }

    private async renderFrame(): Promise<void> {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        this.bufContext2D.drawImage(video, 0.0, 0.0)

        const frame: ImageData = this.bufContext2D.getImageData(0, 0, video.videoWidth, video.videoHeight)
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

        const element: HTMLVideoElement = this.videoElement.nativeElement

        //@ts-ignore
        this.bufCanvas = new OffscreenCanvas(element.videoWidth, element.videoHeight)
        this.bufContext2D = this.bufCanvas.getContext('2d')

        this.time = element.currentTime
        this.duration = element.duration

        setTimeout(() => {
            this.renderFrame().catch((e: Error) => {
                console.error(e)
            })
        }, 100)
    }

    private async onNext(): Promise<void> {
        const element: HTMLVideoElement = this.videoElement.nativeElement

        if (Math.abs(element.currentTime - element.duration) < 0.001) {
            await this.videoStudioService.done()
            return
        }

        this.next()
    }

    next(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.min(element.duration, element.currentTime + this.seekTime)
    }

    previous(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.max(0.0, element.currentTime - this.seekTime)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}