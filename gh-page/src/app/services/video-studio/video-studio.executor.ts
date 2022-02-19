import { Color } from "src/app/utils/color"
import * as WebMWriter from "webm-writer"
import { VideoBackgroundOptions } from "./background/video-background-options"
import { VideoBackgroundSimulation } from "./background/video-background-simulation"
import { VideoForegroundItem } from "./video-foreground-item"
import { VideoFrame } from "./video-frame"
import { VideoGreenScreenMode } from "./video-green-screen-mode"
import { VideoGreenScreenOptions } from "./video-green-screen-options"
import { VideoInfo } from "./video-info"

export class VideoStudioExecutor {

    private lastUpdate: number

    private frame: VideoFrame | undefined

    private bufCanvas: any | undefined
    private bufContext2D: any | undefined

    private videoWriter: WebMWriter | undefined

    private foregrounds: VideoForegroundItem[]
    private background: VideoBackgroundSimulation | undefined
    private chromaKeyOut: (r: number, g: number, b: number) => boolean

    constructor() {
        this.lastUpdate = 0
        this.foregrounds = []
    }

    private createOffscreenCanvas(width: number, height: number): void {
        //@ts-ignore
        this.bufCanvas = new OffscreenCanvas(width, height)
        this.bufContext2D = this.bufCanvas.getContext('2d')
    }

    async initialize(info: VideoInfo): Promise<void> {
        this.videoWriter = new WebMWriter({
            quality: 1.0,
            frameRate: info.frameRate,
            frameDuration: info.frameDuration,
        })

        this.createOffscreenCanvas(info.width, info.height)

        if (this.frame) {
            this.lastUpdate = this.frame.time
        } else {
            this.lastUpdate = 0
        }
    }

    async setFrame(frame: VideoFrame): Promise<void> {
        this.frame = frame
    }

    async setBackground(background: VideoBackgroundOptions | undefined): Promise<void> {
        if (!background) {
            this.background = undefined
            return
        }

        this.background = new VideoBackgroundSimulation(background)
        await this.background.init()
    }

    async setGreenScreen(greenScreen: VideoGreenScreenOptions | undefined): Promise<void> {
        this.chromaKeyOut = this.createChromaKeyOut(greenScreen)
    }

    private createChromaKeyOut(greenScreen: VideoGreenScreenOptions | undefined): (r: number, g: number, b: number) => boolean {
        // check if green screen disabled
        if (!greenScreen) {
            return (r: number, g: number, b: number) => {
                return false
            }
        }

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

    async greenScreen(): Promise<VideoFrame | undefined> {
        // check if a frame given
        if (!this.frame) {
            return undefined
        }

        // check if chrome key out function given
        if (!this.chromaKeyOut) {
            return this.frame
        }

        // create a copy of the current frame
        const data: Uint8ClampedArray = new Uint8ClampedArray(this.frame.data)

        for (let i: number = 0; i < data.length; i += 4) {
            // get red, green and blue
            const r: number = data[i + 0]
            const g: number = data[i + 1]
            const b: number = data[i + 2]

            // set the alpha channel
            if (this.chromaKeyOut(r, g, b)) {
                data[i + 3] = 0
            }
        }

        // create a new frame
        return {
            data,
            time: this.frame.time,
            width: this.frame.width,
            height: this.frame.height,
            counter: this.frame.counter,
        }
    }

    async setForegrounds(foregrounds: VideoForegroundItem[]): Promise<void> {
        this.foregrounds = foregrounds
    }

    async renderFrame(): Promise<VideoFrame | undefined> {
        if (!this.frame) {
            return undefined
        }

        if (!this.bufCanvas || !this.bufContext2D) {
            this.createOffscreenCanvas(this.frame.width, this.frame.height)
        }

        this.bufContext2D.fillStyle = "rgb(42,50,61)"
        // clear out the buffer canvas for the next frame
        this.bufContext2D.fillRect(0, 0, this.bufCanvas.width, this.bufCanvas.height)

        // draw the background
        this.renderBackground()

        const greenScreenFrame: VideoFrame = await this.greenScreen()
        this.putImageData(greenScreenFrame, 0, 0)

        // render the foreground
        this.renderForeground(this.frame.time)

        const frame: ImageData = this.bufContext2D.getImageData(0, 0, this.bufCanvas.width, this.bufCanvas.height)

        // create a new frame
        return {
            data: frame.data,
            time: this.frame.time,
            width: this.frame.width,
            height: this.frame.height,
            counter: this.frame.counter,
        }
    }

    async next(): Promise<void> {
        if (!this.frame) {
            return
        }

        await this.renderFrame()
        await this.canvasToVideoWriter()
        // update for next frame
        this.update()
    }

    private putImageData(image: ImageData, x: number, y: number): void {
        const canvas: ImageData = this.bufContext2D.getImageData(x, y, image.width, image.height);

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

        this.bufContext2D.putImageData(canvas, x, y)
    }

    private async canvasToVideoWriter(): Promise<void> {
        const blob: Blob = await this.bufCanvas.convertToBlob({ type: 'image/webp', quality: 0.9999 })
        const content: string = await this.blobToDataURL(blob)
        this.videoWriter.addFrame(content)
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
        this.background.render(this.bufContext2D)
    }

    private renderForeground(time: number): void {
        this.foregrounds.filter((item: VideoForegroundItem) => {
            return item.time <= time && time <= (item.time + item.duration)
        }).forEach((item: VideoForegroundItem) => {
            this.bufContext2D.save()

            this.bufContext2D.textAlign = "center"
            this.bufContext2D.textBaseline = "middle"
            this.bufContext2D.font = `${item.fontSize}px ${item.font}`
            if (!!item.fillStyle) {
                this.bufContext2D.fillStyle = item.fillStyle
                this.bufContext2D.fillText(item.text, item.x, item.y)
            }

            if (!!item.strokeStyle) {
                this.bufContext2D.strokeStyle = item.strokeStyle
                this.bufContext2D.strokeText(item.text, item.x, item.y)
            }

            this.bufContext2D.restore()
        })

    }

    private update(): void {
        if (!this.frame) {
            return
        }

        const delta: number = this.frame.time - this.lastUpdate
        this.lastUpdate = this.frame.time

        if (this.background) {
            this.background.update(delta)
        }
    }

    async done(): Promise<string> {
        const blob: Blob = await this.videoWriter.complete()
        const url: string = URL.createObjectURL(blob)
        return url
    }

}