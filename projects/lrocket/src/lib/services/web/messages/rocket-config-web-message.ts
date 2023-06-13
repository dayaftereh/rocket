import { WebMessage } from "./web-message";

export interface RocketConfigWebMessage extends WebMessage {
    // FlightComputerConfig
    launchAccelerationThreshold: number;
    liftOffVelocityThreshold: number;
    mecoAccelerationThreshold: number;
    apogeeVelocityThreshold: number;
    landedOrientationCount: number;
    landedOrientationThreshold: number;
    landedAccelerationThreshold: number;
    landedChangeDetectTimeout: number;
    flightTerminateTimeout: number;

    // NetworkClient
    ssid: string;
    password: string;

    // ParachuteManagerConfig
    parachutePin: number;
    parachuteChannel: number;
    parachuteFrequency: number;
    parachuteOpenDuty: number;
    parachuteCloseDuty: number;

    // Rocket
    statusMessageUpdate: number;
    telemetryMessageUpdate: number;
}