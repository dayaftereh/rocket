export enum GreenScreenMode {
    ChannelRed = "red",
    ChannelGreen = "green",
    ChannelBlue = "blue",
    KeyColor = "key"
}

export interface GreenScreenOptions {
    key: {
        r: number,
        g: number,
        b: number
    }
    hueThreshold: number
    satThreshold: number
    valThreshold: number
    mode: GreenScreenMode
    channelThreshold: number
}