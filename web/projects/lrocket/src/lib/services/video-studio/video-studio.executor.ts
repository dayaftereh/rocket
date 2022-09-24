import { Color } from "src/app/utils/color"
import * as WebMWriter from "webm-writer"
import { VideoBackgroundOptions } from "./background/video-background-options"
import { VideoBackgroundSimulation } from "./background/video-background-simulation"
import { VideoBackgroundSimulationOptions } from "./background/video-background-simulation-options"
import { VideoExport } from "./video-export"
import { VideoForegroundItem } from "./video-foreground-item"
import { VideoFrame } from "./video-frame"
import { VideoGreenScreenMode } from "./video-green-screen-mode"
import { VideoGreenScreenOptions } from "./video-green-screen-options"
import { VideoMeta } from "./video-meta"
import { VideoOutput } from "./video-output"

export class VideoStudioExecutor {

    private lastUpdate: number

    private frame: VideoFrame | undefined

    private videoWriter: WebMWriter | undefined

    private videoMeta: VideoMeta | undefined
    private videoExport: VideoExport | undefined
    private backgroundOptions: VideoBackgroundOptions | undefined

    private foregrounds: VideoForegroundItem[]
    private background: VideoBackgroundSimulation | undefined
    private chromaKeyOut: (r: number, g: number, b: number) => boolean

    constructor() {
        this.lastUpdate = 0
        this.foregrounds = []
    }

    async setVideoExport(videoExport: VideoExport): Promise<void> {
        this.videoExport = videoExport
    }

    private get exportWidth(): number {
        if (!this.videoExport) {
            return 800
        }
        return this.videoExport.width
    }

    private get exportHeight(): number {
        if (!this.videoExport) {
            return 600
        }
        return this.videoExport.height
    }

    private get filename(): string {
        if (!this.videoExport) {
            return "output.webm"
        }

        return this.videoExport.filename
    }

    async setVideoMeta(videoMeta: VideoMeta): Promise<void> {
        this.videoMeta = videoMeta
        const fps: number = 1.0 / videoMeta.frameDuration

        this.videoWriter = new WebMWriter({
            quality: 1.0,
            frameRate: fps,
            frameDuration: videoMeta.frameDuration,
        })

        if (this.frame) {
            this.lastUpdate = this.frame.time
        } else {
            this.lastUpdate = 0
        }
    }

    private get offsetX(): number {
        if (!this.videoMeta) {
            return 0
        }

        return this.videoMeta.x
    }

    private get offsetY(): number {
        if (!this.videoMeta) {
            return 0
        }
        return this.videoMeta.y
    }

    async setFrame(frame: VideoFrame): Promise<void> {
        this.frame = frame
    }

    async setBackground(backgroundOptions: VideoBackgroundOptions): Promise<void> {
        this.backgroundOptions = backgroundOptions

        if (!backgroundOptions.visible) {
            this.background = undefined
            return
        }

        const options: VideoBackgroundSimulationOptions = Object.assign({}, backgroundOptions, {
            x: 0,
            y: 0,
            width: this.exportWidth,
            height: this.exportHeight,
            distance: backgroundOptions.distance * Math.max(this.exportWidth, this.exportHeight)
        })

        this.background = new VideoBackgroundSimulation(options)
        await this.background.init()
    }

    private get backgroundColor(): string {
        if (!this.backgroundOptions) {
            return "rgb(42,50,61)"
        }

        return this.backgroundOptions.color
    }

    async setGreenScreen(greenScreen: VideoGreenScreenOptions | undefined): Promise<void> {
        if (!greenScreen.enabled) {
            this.chromaKeyOut = undefined
            return
        }

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
            const { r, g, b } = Color.hexToRgb(greenScreen.key)
            // convert key color to hsv
            const key: any = Color.rgbToHsv(r, g, b)

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

    async renderFrame(bufCanvas?: any): Promise<VideoFrame | undefined> {
        if (!this.frame) {
            return undefined
        }

        // check if a buf canvas given
        if (!bufCanvas) {
            // @ts-ignore
            bufCanvas = new OffscreenCanvas(this.exportWidth, this.exportHeight)
        }

        // @ts-ignore
        const bufContext2D: OffscreenCanvasRenderingContext2D = bufCanvas.getContext("2d")

        // set the background color
        bufContext2D.fillStyle = this.backgroundColor
        // clear out the buffer canvas for the next frame
        bufContext2D.fillRect(0, 0, bufCanvas.width, bufCanvas.height)

        // draw the background
        this.renderBackground(bufContext2D)

        // get the frame with or without green screen
        const greenScreenFrame: VideoFrame = await this.greenScreen()
        // put the frame to the buffer canvas
        this.putImageData(bufContext2D, greenScreenFrame, this.offsetX, this.offsetY)

        // render the foreground
        this.renderForeground(this.frame.time, bufContext2D)

        // get the current frame
        const frame: ImageData = bufContext2D.getImageData(0, 0, bufCanvas.width, bufCanvas.height)
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

        // @ts-ignore
        const bufCanvas: any = new OffscreenCanvas(this.exportWidth, this.exportHeight)
        // render the frame to the given offscreen canvas
        await this.renderFrame(bufCanvas)

        // write the offscreen canvas to vidoe writer
        await this.canvasToVideoWriter(bufCanvas)

        // update for next frame
        this.update()
    }

    // @ts-ignore
    private putImageData(bufContext2D: OffscreenCanvasRenderingContext2D, image: ImageData, x: number, y: number): void {
        const canvas: ImageData = bufContext2D.getImageData(x, y, image.width, image.height);

        for (let i: number = 0; i < image.data.length; i += 4) {
            const a: number = image.data[i + 3]
            // skip the alpha close to zero
            if (a <= 0) {
                continue
            }

            canvas.data[i] = image.data[i]
            canvas.data[i + 1] = image.data[i + 1]
            canvas.data[i + 2] = image.data[i + 2]
            canvas.data[i + 3] = image.data[i + 3]
        }

        bufContext2D.putImageData(canvas, x, y)
    }

    private async canvasToVideoWriter(bufCanvas: any): Promise<void> {
        const blob: Blob = await bufCanvas.convertToBlob({ type: 'image/webp', quality: 0.99999 })
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

    // @ts-ignore
    private renderBackground(bufContext2D: OffscreenCanvasRenderingContext2D): void {
        if (!this.background) {
            return
        }
        // draw the background
        this.background.render(bufContext2D)
    }

    // @ts-ignore
    private renderForeground(time: number, bufContext2D: OffscreenCanvasRenderingContext2D): void {
        this.foregrounds.filter((item: VideoForegroundItem) => {
            return item.time <= time && time <= (item.time + item.duration)
        }).forEach((item: VideoForegroundItem) => {
            bufContext2D.save()

            bufContext2D.textAlign = "center"
            bufContext2D.textBaseline = "middle"
            bufContext2D.font = `${item.fontSize}px ${item.font}`
            if (item.useFillStyle) {
                bufContext2D.fillStyle = item.fillStyle
                bufContext2D.fillText(item.text, item.x, item.y)
            }

            if (item.useStrokeStyle) {
                bufContext2D.strokeStyle = item.strokeStyle
                bufContext2D.strokeText(item.text, item.x, item.y)
            }

            bufContext2D.restore()
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

    async done(): Promise<VideoOutput> {
        const blob: Blob = await this.videoWriter.complete()
        const url: string = URL.createObjectURL(blob)
        return {
            url,
            filename: this.filename
        }
    }

}