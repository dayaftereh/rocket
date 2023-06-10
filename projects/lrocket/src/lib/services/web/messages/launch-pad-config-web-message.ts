import { WebMessage } from "./web-message";

export interface LaunchPadConfigWebMessage extends WebMessage {
    ssid: string
    password: string
    captivePortal: boolean

    // Config
    voltageFactor: number
    voltageOffset: number

    voltageLimit: number

    pressureFactor: number
    pressureOffset: number

    honkDuration: number
    launchValveOpenedDuration: number
    abortClosePressureThreshold: number

    startupTimeout: number

    rocketConnectedState: number
    rocketConnectingTimeout: number
    rocketSignalElapsedThreshold: number

    pressurisingTimeout: number

    targetPressure: number

    pressureDropLimit: number

    tankChillDuration: number

    rocketStartupTimeout: number

    rocketStartupState: number
}