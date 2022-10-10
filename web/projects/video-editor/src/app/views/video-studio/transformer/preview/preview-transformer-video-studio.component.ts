import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { VideoFrame } from "src/app/services/video-studio/video-frame";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";

@Component({
    selector: 'app-preview-transformer',
    templateUrl: './preview-transformer-video-studio.component.html'
})
export class PreviewTransformerVideoStudioComponent implements AfterViewInit, OnDestroy {

    @ViewChild("canvas")
    canvas: ElementRef<HTMLCanvasElement> | undefined

    @ViewChild("canvasParent")
    canvasParent: ElementRef<HTMLElement> | undefined

    visible: boolean

    loading: boolean

    private subscriptions: Subscription[]

    private context2D: CanvasRenderingContext2D | undefined

    constructor(private readonly videoStudioService: VideoStudioService) {
        this.visible = false
        this.loading = false
        this.subscriptions = []
    }

    ngAfterViewInit(): void {
        // get the canvas
        const canvas: HTMLCanvasElement = this.canvas.nativeElement
        // create the canvas context
        this.context2D = canvas.getContext("2d")

        // subscribe to frame changes
        const frameSubscription: Subscription = this.videoStudioService.frameAsObservable().subscribe(async () => {
            await this.onFrame()
        })

        this.subscriptions.push(frameSubscription)

    }

    async onFrame(): Promise<void> {
        this.loading = true
        try {
            await this._onFrame()
        } finally {
            this.loading = false
        }
    }

    async _onFrame(): Promise<void> {
        // check if the dialog is open
        if (!this.visible) {
            return
        }

        // render the current frame
        const frame: VideoFrame | undefined = await this.videoStudioService.renderFrame()
        if (!frame) {
            return
        }


        // @ts-ignore
        const bufCanvas: any = new OffscreenCanvas(frame.width, frame.height)
        const bufContext2D: CanvasRenderingContext2D = bufCanvas.getContext("2d")
        // create a empty image data
        const imageData: ImageData = bufContext2D.createImageData(frame.width, frame.height)
        for (let i: number = 0; i < frame.data.length; i++) {
            imageData.data[i] = frame.data[i]
        }
        // put the image to the OffscreenCanvas
        bufContext2D.putImageData(imageData, 0, 0)

        // get the canvas
        const canvas: HTMLCanvasElement = this.canvas.nativeElement

        // draw the frame scaled to the canvas
        this.context2D.save()
        this.context2D.scale(canvas.width / bufCanvas.width, canvas.height / bufCanvas.height)
        this.context2D.drawImage(bufCanvas, 0, 0)
        this.context2D.restore()
    }


    onResizeEnd(): void {
        const parent: HTMLElement = this.canvasParent.nativeElement
        const canvas: HTMLCanvasElement = this.canvas.nativeElement

        canvas.width = 0
        canvas.height = 0

        canvas.width = parent.clientWidth * 0.95
        canvas.height = canvas.width * 9 / 16
    }

    async onShow(): Promise<void> {
        this.onResizeEnd()
        await this.onFrame()
    }

    open(): void {
        this.visible = true
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}