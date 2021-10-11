import { Constants } from "../constants/constants";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";

export class SingleSimulation {

    constructor(
        private readonly constants: Constants,
        private readonly config: SingleSimulationConfig
    ) {

    }

    private get water0(): number {
        return this.config.waterAmount * 1.0
    }

    private get pressure0(): number {
        return this.config.initialPressure * 100000.0
    }

    private get volume0(): number {
        return this.config.bottleVolume / 1000.0
    }

    execute(): SingleSimulationResult {

        return undefined
    }

}