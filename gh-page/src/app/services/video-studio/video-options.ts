import { VideoBackgroundOptions } from "./background/video-background-options";
import { VideoForegroundItem } from "./video-foreground-item";
import { VideoGreenScreenOptions } from "./video-green-screen-options";
import { VideoInformation } from "./video-information";

export interface VideoOptions {
    x: number
    y: number

    information: VideoInformation
    foregrounds: VideoForegroundItem[]
    greenScreen: VideoGreenScreenOptions | undefined
    background: VideoBackgroundOptions | undefined
}