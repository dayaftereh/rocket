import { Subject } from "rxjs";
import { Constants } from "../../constants/constants";
import { MultipleSimulation } from "./multiple-simulation";
import { MultipleSimulationConfig } from "./multiple-simulation-config";
import { MultipleSimulationStep } from "./multiple-simulation-step";

export class MultipleSimulationExecutor {

    private subject: Subject<MultipleSimulationStep>

    constructor() {
        this.subject = new Subject<MultipleSimulationStep>()
    }

    async compute(constants: Constants, config: MultipleSimulationConfig): Promise<MultipleSimulationStep[]> {
        const simulation: MultipleSimulation = new MultipleSimulation(constants, config, this.subject)
        const result: MultipleSimulationStep[] = simulation.execute()
        return result
    }

    async subscribe(callback: (step: MultipleSimulationStep) => Promise<void>): Promise<void> {
        this.subject.subscribe(async (step: MultipleSimulationStep) => {
            if (callback) {
                await callback(step)
            }
        })
    }

}