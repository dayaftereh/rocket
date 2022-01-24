import { VideoGreenScreenMode } from "./video-green-screen-mode";

export interface VideoGreenScreenOptions {
    key: {
        r: number,
        g: number,
        b: number
    }
    hueThreshold: number
    satThreshold: number
    valThreshold: number
    channelThreshold: number
    mode: VideoGreenScreenMode
}