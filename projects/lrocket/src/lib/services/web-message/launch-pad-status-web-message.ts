import { WebMessage } from "./web-message";

export interface LaunchPadStatusWebMessage extends WebMessage {
    state: number

    error: boolean
    connected: boolean

    voltage: number
    pressure: number
}