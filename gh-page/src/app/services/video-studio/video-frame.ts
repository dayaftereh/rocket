export interface VideoFrame {
    time: number
    counter: number
    width: number
    height: number
    data: Uint8ClampedArray
}