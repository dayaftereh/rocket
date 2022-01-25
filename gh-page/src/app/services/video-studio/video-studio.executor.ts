import { Color } from "src/app/utils/color"
import * as WebMWriter from "webm-writer"
import { VideoBackgroundSimulation } from "./background/video-background-simulation"
import { VideoForegroundItem } from "./video-foreground-item"
import { VideoFrame } from "./video-frame"
import { VideoGreenScreenMode } from "./video-green-screen-mode"
import { VideoGreenScreenOptions } from "./video-green-screen-options"
import { VideoOptions } from "./video-options"

export class VideoStudioExecutor {

    private options: VideoOptions | undefined

    private background: VideoBackgroundSimulation | undefined

    private bufferCanvas: any | undefined
    private bufferContext: any | undefined


    private videoBuffer: WebMWriter

    private chromaKeyOut: (r: number, g: number, b: number) => boolean

    constructor() {

    }

    async start(options: VideoOptions): Promise<void> {
        this.options = options
        //@ts-ignore
        this.bufferCanvas = new OffscreenCanvas(options.information.width, options.information.height)
        this.bufferContext = this.bufferCanvas.getContext("2d")

        // create the background
        if (!!this.options.background) {
            this.background = new VideoBackgroundSimulation(this.options.background)
            await this.background.init()
        } else {
            this.background = undefined
        }

        // create the green screen chromaKey function
        this.chromaKeyOut = this.createChromaKeyOut(options)

        this.videoBuffer = new WebMWriter({
            quality: 1.0,
            frameDuration: null,
            frameRate: this.options.information.frameRate,
        })
    }

    private createChromaKeyOut(options: VideoOptions): (r: number, g: number, b: number) => boolean {
        // check if green screen disabled
        if (!this.options.greenScreen) {
            return (r: number, g: number, b: number) => {
                return false
            }
        }

        const greenScreen: VideoGreenScreenOptions = this.options.greenScreen

        // check if key color mode active
        if (greenScreen.mode === VideoGreenScreenMode.KeyColor) {
            // convert key color to hsv
            const key: any = Color.rgbToHsv(
                greenScreen.key.r,
                greenScreen.key.g,
                greenScreen.key.b
            )

            return (r: number, g: number, b: number) => {
                // convert frame color to hsv
                const frame: any = Color.rgbToHsv(r, g, b)

                // check the threshold
                if (Math.abs(key.h - frame.h) >= greenScreen.hueThreshold) {
                    return false
                }

                if (Math.abs(key.s - frame.s) >= greenScreen.satThreshold) {
                    return false
                }

                if (Math.abs(key.v - frame.v) >= greenScreen.valThreshold) {
                    return false
                }

                return true
            }
        }

        const closeEquals = (a: number, b: number) => {
            return Math.abs(a - b) < 0.01
        }

        return (r: number, g: number, b: number) => {
            const max = Math.max(r, g, b);

            if (greenScreen.mode === VideoGreenScreenMode.ChannelGreen) {
                if (!closeEquals(max, g)) {
                    return false
                }

                const mid: number = Math.max(r, b)
                return max - mid > greenScreen.channelThreshold
            }

            if (greenScreen.mode === VideoGreenScreenMode.ChannelBlue) {
                if (!closeEquals(max, b)) {
                    return false
                }

                const mid: number = Math.max(r, g)
                return max - mid > greenScreen.channelThreshold
            }

            if (greenScreen.mode === VideoGreenScreenMode.ChannelRed) {
                if (!closeEquals(max, r)) {
                    return false
                }

                const mid: number = Math.max(b, g)
                return max - mid > greenScreen.channelThreshold
            }

            return false
        }
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
                image.data[i + 3] = 0
            }
        }
    }

    async frame(frame: VideoFrame): Promise<void> {
        this.bufferContext.fillStyle = "rgb(42,50,61)"
        // clear out the buffer canvas for the next frame
        this.bufferContext.fillRect(0, 0, this.options.information.width, this.options.information.height)

        // draw the background
        this.renderBackground()

        // convert the frame to image data
        const image: ImageData = this.createImageDataFromFrame(frame)
        // insert the frame
        this.putImageData(image, this.options.x, this.options.y)

        // render the foreground
        this.renderForeground(frame.time)

        const blob: Blob = await this.bufferCanvas.convertToBlob({ type: 'image/webp', quality: 0.9999 })
        const content: string = await this.blobToDataURL(blob)
        this.videoBuffer.addFrame(content)
    }

    private putImageData(image: ImageData, x: number, y: number): void {
        const canvas: ImageData = this.bufferContext.getImageData(0, 0, image.width, image.height);

        for (let i: number = 0; i < image.data.length; i += 4) {
            const a: number = image.data[i + 3]
            if (a <= 0) {
                continue
            }

            canvas.data[i] = image.data[i]
            canvas.data[i + 1] = image.data[i + 1]
            canvas.data[i + 2] = image.data[i + 2]
            canvas.data[i + 3] = image.data[i + 3]
        }

        this.bufferContext.putImageData(canvas, x, y)
    }

    private async blobToDataURL(blob: Blob): Promise<string> {
        let completed: boolean = false
        const fileReader: FileReader = new FileReader()
        return new Promise(async (resolve, reject) => {

            fileReader.onerror = (e: any) => {
                if (!completed) {
                    reject(e)
                }
                completed = true
            }

            fileReader.onloadend = () => {
                const result: string = fileReader.result as string
                if (!completed) {
                    resolve(result)
                }
                completed = true
            }
            fileReader.readAsDataURL(blob)
        })
    }

    private renderBackground(): void {
        if (!this.background) {
            return
        }

        // draw the background
        this.background.render(this.bufferContext)
    }

    private renderForeground(time: number): void {
        this.options.foregrounds.filter((item: VideoForegroundItem) => {
            return item.time <= time && time <= (item.time + item.duration)
        }).forEach((item: VideoForegroundItem) => {
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
        if (this.background) {
            this.background.update(time)
        }
    }

    async complete(): Promise<string> {
        const blob: Blob = await this.videoBuffer.complete()
        const url: string = URL.createObjectURL(blob)
        return url
    }
}