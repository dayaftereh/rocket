export enum WebMessageType {
    Unknown = 0,
    HelloRocket,
    HelloControlCenter,

    // LaunchPad
    LaunchPadStart,
    LaunchPadAbort,
    LaunchPadStatus,
    LaunchPadConfig,
    ReuqestLaunchPadConfig,

    // Rocket
    RocketStart,
    RocketAbort,
    UnlockAbort,
    RocketStatus,
    RocketTelemetry,
    RocketConfig,
    ReuqestRocketConfig,
}