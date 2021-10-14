export interface SingleSimulationConfig {
    timeStep: number // s
    waterAmount: number // liter
    rocketWeight: number // g
    tankVolume: number // liter
    rocketDiameter: number // mm
    nozzleDiameter: number // mm
    initialPressure: number // bar
    dragCoefficient: number   
}