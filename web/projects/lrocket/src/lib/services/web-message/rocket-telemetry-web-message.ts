import { WebMessage } from "./web-message";

export interface RocketTelemetryWebMessage extends WebMessage {
    time: number

    elapsed: number

    voltage: number
    altitude: number

    rotationX: number
    rotationY: number
    rotationZ: number

    gyroscopeX: number
    gyroscopeY: number
    gyroscopeZ: number

    accelerationX: number
    accelerationY: number
    accelerationZ: number

    magnetometerX: number
    magnetometerY: number
    magnetometerZ: number
}