export interface GreenScreenOptions {
    key: {
        r: number,
        g: number,
        b: number
    }
    hueThreshold: number
    satThreshold: number
    valThreshold: number
    useChannel: boolean
    channelThreshold: number
}