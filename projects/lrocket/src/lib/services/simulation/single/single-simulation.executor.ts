import { Subject } from "rxjs";
import { Constants } from "../../constants/constants";
import { SingleSimulation } from "./single-simulation";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";
import { SingleSimulationStep } from "./single-simulation-step";

export class SingleSimulationExecutor {

    private subject: Subject<SingleSimulationStep>

    constructor() {
        this.subject = new Subject<SingleSimulationStep>()
    }

    async compute(constants: Constants, config: SingleSimulationConfig): Promise<SingleSimulationResult> {
        const singleSimulation: SingleSimulation = new SingleSimulation(constants, config, this.subject)
        const result: SingleSimulationResult = singleSimulation.execute()
        return result
    }

    async subscribe(callback: (step: SingleSimulationStep) => Promise<void>): Promise<void> {
        this.subject.subscribe(async (step: SingleSimulationStep) => {
            if (callback) {
                await callback(step)
            }
        })
    }

}