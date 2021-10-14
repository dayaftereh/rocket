export interface SingleSimulationStep {
    time: number // s
    mass: number // g
    height: number // m
    thrust: number // N
    pressure: number // bar
    velocity: number // m/s
    acceleration: number // m/s2
    flowVelocity: number // m/s
    massFlowRate: number // kg/s
}