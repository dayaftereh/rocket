import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { FileUpload } from "primeng/fileupload";
import { GreenScreen } from "./green-screen";

@Component({
    templateUrl: './green-screen-video-studio.component.html'
})
export class GreenScreenVideoStudioComponent implements AfterViewInit, OnDestroy {

    @ViewChild("fileUpload")
    fileUpload: FileUpload | undefined

    @ViewChild("canvas")
    canvasElement: ElementRef<HTMLCanvasElement> | undefined

    @ViewChild("video")
    videoElement: ElementRef<HTMLVideoElement> | undefined

    private greenScreen: GreenScreen | undefined

    constructor() {

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

    async ngAfterViewInit(): Promise<void> {
        const video: HTMLVideoElement = this.videoElement.nativeElement
        const canvas: HTMLCanvasElement = this.canvasElement.nativeElement

        this.greenScreen = new GreenScreen(video, canvas)
        await this.greenScreen.init()
    }

    ngOnDestroy(): void {
        if (this.greenScreen) {
            this.greenScreen.destroy()
        }
    }

}