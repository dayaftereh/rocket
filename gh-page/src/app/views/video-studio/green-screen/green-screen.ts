import { GridLineOptions } from "chart.js"
import { GreenScreenOptions } from "./green-screen-options"

export class GreenScreen {

    private buf: HTMLCanvasElement

    private options: GreenScreenOptions

    private context2d: CanvasRenderingContext2D
    private bufContext2d: CanvasRenderingContext2D

    constructor(
        private readonly video: HTMLVideoElement,
        private readonly canvas: HTMLCanvasElement,
    ) {
        this.options = {
            useChannel: false,
            hueThreshold: 0.5,
            satThreshold: 0.5,
            valThreshold: 0.5,
            channelThreshold: 0.5,
            key: {
                r: 14,
                g: 255,
                b: 0
            }
        }
    }

    async init(): Promise<void> {
        this.buf = document.createElement("canvas")

        this.bufContext2d = this.buf.getContext("2d")
        this.context2d = this.canvas.getContext("2d")

        this.video.addEventListener("play", () => {
            this.onPlay()
        })

        this.video.addEventListener("resize", () => {
            this.onResize()
        })
    }

    changeOptions(options: GreenScreenOptions, repaint: boolean): void {
        this.options = options
        if (repaint) {
            this.render()
        }
    }

    private registerRequestVideoFrameCallback(): void {
        if (this.video.paused || this.video.ended) {
            return
        }

        (this.video as any).requestVideoFrameCallback(() => {
            this.frameCallback()
        })
    }

    private frameCallback(): void {
        this.registerRequestVideoFrameCallback()
        this.render()
    }

    private render(): void {
        this.bufContext2d.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
        const frame: ImageData = this.bufContext2d.getImageData(0, 0, this.video.videoWidth, this.video.videoHeight)

        const key: any = GreenScreen.rgbToHsv(this.options.key.r, this.options.key.g, this.options.key.b)

        let chromaKeyOut = (r: number, g: number, b: number) => {
            return this.chromaKeyOutHSV(r, g, b, key)
        }

        if (this.options.useChannel) {
            chromaKeyOut = (r: number, g: number, b: number) => {
                return this.chromaKeyOutChannel(r, g, b)

            }
        }

        for (let i = 0; i < frame.data.length; i += 4) {
            const r: number = frame.data[i + 0]
            const g: number = frame.data[i + 1]
            const b: number = frame.data[i + 2]

            if (chromaKeyOut(r, g, b)) {
                frame.data[i + 3] = 0
            }
        }

        this.context2d.putImageData(frame, 0, 0)
    }

    static rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {

        r /= 255.0
        g /= 255.0
        b /= 255.0

        const max: number = Math.max(r, g, b)
        const min: number = Math.min(r, g, b);

        let h: number
        let s: number
        let v: number = max;

        const d: number = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6.0 : 0.0); break;
                case g: h = (b - r) / d + 2.0; break;
                case b: h = (r - g) / d + 4.0; break;
            }

            h /= 6.0;
        }

        return {
            h, s, v
        };
    }

    private chromaKeyOutHSV(r: number, g: number, b: number, keyHSV: any): boolean {
        const pixel: any = GreenScreen.rgbToHsv(r, g, b)

        if (Math.abs(pixel.h - keyHSV.h) > this.options.hueThreshold) {
            return false
        }

        if (Math.abs(pixel.s - keyHSV.s) > this.options.satThreshold) {
            return false
        }

        if (Math.abs(pixel.v - keyHSV.v) > this.options.valThreshold) {
            return false
        }

        return true
    }

    private chromaKeyOutChannel(r: number, g: number, b: number): boolean {
        const max: number = Math.max(r, g, b);
        if (Math.abs(max - g) > 0.1) {
            return false
        }

        const mid: number = Math.max(r, b);
        return max - mid > this.options.channelThreshold;
    }

    private onResize(): void {
        this.buf.width = this.video.videoWidth
        this.buf.height = this.video.videoHeight

        this.canvas.width = this.video.videoWidth
        this.canvas.height = this.video.videoHeight
    }

    private onPlay(): void {

        this.registerRequestVideoFrameCallback()
    }

    destroy(): void {

    }

}