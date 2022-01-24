import { VideoBackgroundOptions } from "./background/video-background-options";
import { VideoGreenScreenOptions } from "./video-green-screen-options";
import { VideoForegroundItem } from "./video-foreground-item";

export interface VideoOptions {
    x: number
    y: number
    width: number
    height: number

    frameRate: number

    foregrounds: VideoForegroundItem[]
    greenScreen: VideoGreenScreenOptions | undefined
    background: VideoBackgroundOptions | undefined
}