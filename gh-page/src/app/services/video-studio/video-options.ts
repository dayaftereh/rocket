import { GreenScreenOptions } from "./green-screen-options";

export interface ForegroundItem {
    x: number
    y: number
    time: number
    duration: number
    text: string
    font: string
    fillStyle: string | undefined
    strokeStyle: string | undefined
}

export interface VideoOptions {
    width: number
    height: number
    x: number
    y: number
    frameRate: number
    greenScreen: GreenScreenOptions | undefined
    foregrounds: ForegroundItem[]
}