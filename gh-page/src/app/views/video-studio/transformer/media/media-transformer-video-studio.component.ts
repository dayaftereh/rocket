import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { VideoFrame } from "src/app/services/video-studio/video-frame";
import { VideoInformation } from "src/app/services/video-studio/video-information";

@Component({
    selector: 'app-media-transformer',
    templateUrl: "./media-transformer-video-studio.component.html"
})
export class MediaTransformerVideoStudioComponent implements AfterViewInit {

    @ViewChild("parent")
    parent: ElementRef<HTMLElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    onFrame: ((frame: VideoFrame) => Promise<void>) | undefined

    @Output()
    onFinished: EventEmitter<void>

    seekTime: number = 1.0 / 60.0

    loaded: boolean

    private lastTimeUpdate: number

    private bufCanvas: any | undefined
    private bufContext2D: any | undefined

    constructor() {
        this.loaded = false
        this.lastTimeUpdate = -1.0
        this.onFinished = new EventEmitter<void>(true)

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
        const video: HTMLVideoElement = this.videoElement.nativeElement
        video.addEventListener("timeupdate", () => {
            this.onTimeUpdate()
        })

        video.addEventListener("loadeddata", () => {
            this.onCanPlay()
        })

        // register for the prarent element
        const parent: HTMLElement = this.parent.nativeElement
        parent.addEventListener("resize", () => {
            this.resizeVideo()
        })

        this.resizeVideo()
    }

    private onCanPlay(): void {
        this.loaded = true
    }

    next(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.max(0.0, element.currentTime - this.seekTime)
    }

    previous(): void {
        const element: HTMLVideoElement = this.videoElement.nativeElement
        element.currentTime = Math.min(element.duration, element.currentTime + this.seekTime)
    }

    private closeEquals(a: number, b: number): boolean {
        return Math.abs(a - b) < 0.0001
    }

    private onTimeUpdate(): void {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        const time: number = video.currentTime

        // check if a time change happens
        if (this.closeEquals(time, this.lastTimeUpdate)) {
            return
        }

        this.lastTimeUpdate = time
    }

    private resizeVideo(): void {
        const parent: HTMLElement = this.parent.nativeElement
        const video: HTMLVideoElement = this.videoElement.nativeElement

        video.width = parent.clientWidth * 0.95
        video.height = parent.clientHeight
    }

}