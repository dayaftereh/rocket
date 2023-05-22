import { WebMessage } from "./web-message";

export interface RocketConfigWebMessage extends WebMessage {
    // FlightComputerConfig
    launchAccelerationThreshold: number

    liftOffVelocityThreshold: number

    mecoAccelerationThreshold: number

    apogeeVelocityThreshold: number

    landedOrientationCount: number
    landedOrientationThreshold: number
    landedAccelerationThreshold: number
    landedChangeDetectTimeout: number

    flightTerminateTimeout: number

    // NetworkConfig
    ssid: string
    password: string

    // Rocket
    parachuteTimeout: number
}