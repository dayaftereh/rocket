import { SingleSimulationConfig } from "../single/single-simulation-config";

export interface MultipleSimulationStep {
    config: SingleSimulationConfig
    duration: number
    progress: number
    maxHeight: number
}