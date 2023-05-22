import { SingleSimulationConfig } from "../single/single-simulation-config";

export interface MultipleSimulationConfig {
    base: SingleSimulationConfig

    nozzleDiameterStep: number // mm
    nozzleDiameterMinimum: number // mm
    nozzleDiameterMaximum: number // mm

    waterAmountStep: number // liter
    waterAmountMinimum: number // liter
    waterAmountMaximum: number // liter

    limit: number
}