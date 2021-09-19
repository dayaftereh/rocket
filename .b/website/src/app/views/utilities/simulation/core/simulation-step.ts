export interface SimulationStep {
    time: number
    mass: number
    velocity: number
    flowVelocity: number
    massFlowRate: number
    thrust: number
    pressure: number
    tankVolume: number
    drag: number
    gravity: number
    height: number
}