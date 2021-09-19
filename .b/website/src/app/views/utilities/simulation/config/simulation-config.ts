import { Globals } from "../../../../services/globals/globals";

export interface SimulationConfig {
    rocketWeight: number // in g
    rocketDiameter: number // in mm
    tankVolume: number // in L
    tankPressure: number // in bar
    nozzleDiameter: number // in mm
    thrustNozzleCount: number
    dragCoefficient: number
    simulationDuration: number // in s
    stepTime: number // in s
    kappa: number
    globals: Globals
}