import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { fromEvent, Subscription } from "rxjs";
import { VideoFrame } from "src/app/services/video-studio/video-frame";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";

@Component({
    selector: 'app-media-transformer',
    templateUrl: "./media-transformer-video-studio.component.html"
})
export class MediaTransformerVideoStudioComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("videoParent")
    videoParent: ElementRef<HTMLElement> | undefined

    @ViewChild("canvasParent")
    canvasParent: ElementRef<HTMLElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    @ViewChild("canvas")
    canvasElement: ElementRef<HTMLCanvasElement> | undefined

    time: number
    frames: number
    duration: number

    sliderTime: number

    seekTime: number = 1.0 / 60.0
    seekTimes: SelectItem[]

    loaded: boolean

    private epsilon: number = 0.00001

    private bufCanvas: any | undefined
    private bufContext2D: CanvasRenderingContext2D | undefined

    private canvasContext2D: CanvasRenderingContext2D | undefined

    private subscriptions: Subscription[]

    constructor(
        private readonly videoStudioService: VideoStudioService) {
        this.time = 0
        this.frames = 0
        this.duration = 0
        this.sliderTime = 0
        this.loaded = false
        this.seekTimes = []
        this.subscriptions = []
    }

    ngOnInit(): void {
        const nextSubscription: Subscription = this.videoStudioService.nextAsObservable().subscribe(async () => {
            await this.onNext()
        })

        const frameSubscription: Subscription = this.videoStudioService.frameAsObservable().subscribe(async () => {
            this.onFrame()

        })

        this.subscriptions.push(nextSubscription, frameSubscription)

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
        const videoParent: HTMLElement = this.videoParent.nativeElement
        const resizeVideoSubscription: Subscription = fromEvent(videoParent, "resize").subscribe(() => {
            this.onVideoResize()
        })

        // get the preview canvas
        const canvas: HTMLCanvasElement = this.canvasElement.nativeElement
        this.canvasContext2D = canvas.getContext("2d")

        // register for the parent element
        const canvasParent: HTMLElement = this.canvasParent.nativeElement
        const resizeCanvasSubscription: Subscription = fromEvent(canvasParent, "resize").subscribe(() => {
            this.onCanvasResize()
        })

        this.subscriptions.push(timeupdateSubscription, loadedSubscription, resizeVideoSubscription, resizeCanvasSubscription)

        this.onVideoResize()
        this.onCanvasResize()
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
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
       this.onCanvasResize()
       this.onVideoResize()
    }

    private onVideoResize(): void {
        const parent: HTMLElement = this.videoParent.nativeElement
        const video: HTMLVideoElement = this.videoElement.nativeElement

        video.width = parent.clientWidth * 0.95
        video.height = parent.clientHeight
    }

    private onCanvasResize(): void {
        const parent: HTMLElement = this.canvasParent.nativeElement
        const canvas: HTMLCanvasElement = this.canvasElement.nativeElement

        canvas.width = parent.clientWidth * 0.95
        canvas.height = parent.clientHeight
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

        if (Math.abs(element.currentTime - element.duration) < this.epsilon) {
            await this.videoStudioService.done()
            return
        }

        this.next()
    }

    private async onFrame(): Promise<void> {
        const frame: VideoFrame | undefined = await this.videoStudioService.renderFrame()
        if (!frame) {
            return
        }

        // @ts-ignore
        const bufCanvas: any = new OffscreenCanvas(frame.width, frame.height)
        const bufContext2D: CanvasRenderingContext2D = bufCanvas.getContext("2d")
        const imageData: ImageData = bufContext2D.createImageData(frame.width, frame.height)
        for (let i: number = 0; i < frame.data.length; i++) {
            imageData.data[i] = frame.data[i]
        }
        bufContext2D.putImageData(imageData, 0, 0)

        const canvas: HTMLCanvasElement = this.canvasElement.nativeElement

        this.canvasContext2D.save()
        this.canvasContext2D.scale(canvas.width / frame.width, canvas.height / frame.height)
        this.canvasContext2D.drawImage(bufCanvas, 0, 0)
        this.canvasContext2D.restore()
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