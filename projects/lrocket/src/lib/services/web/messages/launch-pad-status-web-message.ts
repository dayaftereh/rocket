import { LaunchPadComputerState } from "./launch-pad-computer-state";
import { WebMessage } from "./web-message";

export interface LaunchPadStatusWebMessage extends WebMessage {
    state: LaunchPadComputerState

    error: boolean
    connected: boolean

    voltage: number
    pressure: number
}