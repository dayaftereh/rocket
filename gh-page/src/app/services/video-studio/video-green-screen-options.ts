import { VideoGreenScreenMode } from "./video-green-screen-mode";

export interface VideoGreenScreenOptions {
    key: string
    enabled: boolean
    hueThreshold: number
    satThreshold: number
    valThreshold: number
    channelThreshold: number
    mode: VideoGreenScreenMode
}