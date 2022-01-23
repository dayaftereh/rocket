import { VideoFrame } from "./video-frame"
import { ForegroundItem, VideoOptions } from "./video-options"

export class VideoStudioExecutor {

    private options: VideoOptions | undefined
    private bufferCanvas: any | undefined
    private bufferContext: any | undefined

    private chromaKeyOut: (r: number, g: number, b: number) => boolean

    constructor() {

    }

    async start(options: VideoOptions): Promise<void> {
        this.options = options
        //@ts-ignore
        this.bufferCanvas = new OffscreenCanvas(options.width, options.height)
        this.bufferContext = this.bufferCanvas.getContext("2d")
    }

    private createImageDataFromFrame(frame: VideoFrame): ImageData {
        // create a new image data
        const image: ImageData = this.bufferContext.createImageData(frame.width, frame.height)
        // copy frame to image
        for (let i: number = 0; i < image.data.length; i++) {
            image.data[i] = frame.data[i]
        }

        // check if green screen given
        if (!!this.options.greenScreen) {
            // remove the green screen
            this.greenScreen(image)
        }


        return image
    }

    private greenScreen(image: ImageData): void {
        for (let i: number = 0; i < image.data.length; i += 4) {
            // get red, green and blue
            const r: number = image.data[i + 0]
            const g: number = image.data[i + 1]
            const b: number = image.data[i + 2]

            if (this.chromaKeyOut(r, g, b)) {
                image.data[i + 0] = 0
            }
        }
    }

    async frame(frame: VideoFrame): Promise<void> {
        // clear out the buffer canvas for the next frame
        this.bufferContext.clearRect(0, 0, this.options.width, this.options.height)

        // draw the background
        this.renderBackground()

        // convert the frame to image data
        const image: ImageData = this.createImageDataFromFrame(frame)
        // insert the frame
        this.bufferContext.putImageData(image, this.options.x, this.options.y)


        // render the foreground
        this.renderForeground(frame.time)
    }

    private renderBackground(): void {

    }

    private renderForeground(time: number): void {
        this.options.foregrounds.filter((item: ForegroundItem) => {
            return item.time <= time && time <= (item.time + item.duration)
        }).forEach((item: ForegroundItem) => {
            this.bufferContext.save()

            this.bufferContext.font = item.font
            if (!!item.fillStyle) {
                this.bufferContext.fillStyle = item.fillStyle
                this.bufferContext.fillText(item.text, item.x, item.y)
            }

            if (!!item.strokeStyle) {
                this.bufferContext.strokeStyle = item.strokeStyle
                this.bufferContext.strokeText(item.text, item.x, item.y)
            }

            this.bufferContext.restore()
        })

    }

    async update(time: number): Promise<void> {

    }

}