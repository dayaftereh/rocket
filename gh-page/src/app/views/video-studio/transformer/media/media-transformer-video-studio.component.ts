import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { VideoFrame } from "src/app/services/video-studio/video-frame";

@Component({
    selector: 'app-media-transformer',
    templateUrl: "./media-transformer-video-studio.component.html"
})
export class MediaTransformerVideoStudioComponent implements AfterViewInit {

    @ViewChild("parent")
    parent: ElementRef<HTMLElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    @Output()
    onFrame: EventEmitter<VideoFrame>

    @Output()
    onFinished: EventEmitter<void>

    private frameCounter: number

    private bufCanvas: any | undefined
    private bufContext2D: any | undefined

    constructor() {
        this.frameCounter = 0
        this.onFinished = new EventEmitter<void>(true)
        this.onFrame = new EventEmitter<VideoFrame>(true)
    }

    get width(): number {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        return element.videoWidth
    }

    get height(): number {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        return element.videoHeight
    }

    onFile(event: any): void {
        if (!event || !event.files || event.files.length < 1) {
            return
        }

        const file: File = event.files[0]
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.src = URL.createObjectURL(file)
    }

    ngAfterViewInit(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.addEventListener("play", () => {
            this.onPlay()
        })

        element.addEventListener("ended", () => {
            this.onEnded()
        })

        this.resizeVideo()
    }

    private onPlay(): void {
        // reset the frame counter
        this.frameCounter = 0
        // create OffscreenCanvas
        // @ts-ignore
        this.bufCanvas = new OffscreenCanvas(this.width, this.height)
        this.bufContext2D = this.bufCanvas.getContext("2d")

        // register frame callback
        this.registerRequestVideoFrameCallback()
    }

    private onEnded(): void {
        this.onFinished.next()
    }

    play(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.play()
    }

    pause(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.pause()
    }

    private registerRequestVideoFrameCallback(): void {
        this.frameCallback()

        const element: HTMLVideoElement = this.videoElement.nativeElement

        if (element.paused || element.ended) {
            return
        }

        (element as any).requestVideoFrameCallback(() => {
            this.registerRequestVideoFrameCallback()
        })
    }

    private frameCallback(): void {
        this.frameCounter++

        // get the video element
        const element: HTMLVideoElement = this.videoElement.nativeElement
        // draw the video to the OffscreenCanvas
        this.bufContext2D.drawImage(element, 0, 0, this.width, this.height)
        // get the image data
        const frame: ImageData = this.bufContext2D.getImageData(0, 0, this.width, this.height)

        // fire the next frame
        const next: VideoFrame = {
            counter: this.frameCounter,
            data: frame.data,
            width: frame.width,
            height: frame.height,
            time: element.currentTime,
        }

        this.onFrame.next(next)
    }

    private resizeVideo(): void {
        const parent: HTMLElement = this.parent.nativeElement
        const video: HTMLVideoElement = this.videoElement.nativeElement

        video.width = parent.clientWidth * 0.95
        video.height = parent.clientHeight
    }



}