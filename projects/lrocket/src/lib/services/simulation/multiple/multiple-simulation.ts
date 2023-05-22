import { Observable, Subject } from "rxjs";
import { Constants } from "../../constants/constants";
import { SingleSimulation } from "../single/single-simulation";
import { SingleSimulationConfig } from "../single/single-simulation-config";
import { SingleSimulationResult } from "../single/single-simulation-result";
import { SingleSimulationStep } from "../single/single-simulation-step";
import { MultipleSimulationConfig } from "./multiple-simulation-config";
import { MultipleSimulationStep } from "./multiple-simulation-step";

export class MultipleSimulation {

    constructor(
        private readonly constants: Constants,
        private readonly config: MultipleSimulationConfig,
        private readonly subject: Subject<MultipleSimulationStep>,
    ) {

    }

    private get waterAmountMinimum(): number {
        return Math.min(this.config.waterAmountMinimum, this.config.base.tankVolume)
    }

    private get waterAmountMaximum(): number {
        return Math.min(this.config.waterAmountMaximum, this.config.base.tankVolume)
    }

    private get nozzleSteps(): number {
        const nozzleLength: number = this.config.nozzleDiameterMaximum - this.config.nozzleDiameterMinimum
        if (Math.abs(nozzleLength) < 0.001) {
            return 1
        }

        const nozzleSteps: number = nozzleLength / this.config.nozzleDiameterStep
        return Math.ceil(nozzleSteps) + 1
    }

    private get waterAmountSteps(): number {
        const waterAmountLength: number = this.waterAmountMaximum - this.waterAmountMinimum
        if (Math.abs(waterAmountLength) < 0.001) {
            return 1
        }

        const waterAmountSteps: number = waterAmountLength / this.config.waterAmountStep
        return Math.ceil(waterAmountSteps) + 1
    }

    private get singleRunCount(): number {
        return this.waterAmountSteps * this.nozzleSteps
    }

    private createSingleSimulationConfig(waterAmount: number, nozzleDiameter: number): SingleSimulationConfig {
        return Object.assign({}, this.config.base, {
            waterAmount,
            nozzleDiameter,
        })
    }

    private compute(waterAmount: number, nozzleDiameter: number): MultipleSimulationStep {
        // create the config
        const config: SingleSimulationConfig = this.createSingleSimulationConfig(waterAmount, nozzleDiameter)
        const subject: Subject<SingleSimulationStep> = new Subject<SingleSimulationStep>()
        // create the SingleSimulation
        const simulation: SingleSimulation = new SingleSimulation(this.constants, config, subject)
        // execute the single simulation
        const result: SingleSimulationResult = simulation.execute()

        // return the found step
        return {
            config,
            duration: result.duration,
            maxHeight: result.maxHeight,
        } as MultipleSimulationStep
    }

    execute(): MultipleSimulationStep[] {
        const list: MultipleSimulationStep[] = []
        
        let nozzleDiameter: number = this.config.nozzleDiameterMinimum
        const steps: number = this.singleRunCount

        for (let i: number = 0; i < this.nozzleSteps; i++) {
            let waterAmount: number = this.waterAmountMinimum
            for (let j: number = 0; j < this.waterAmountSteps; j++) {
                // compute the step
                const step: MultipleSimulationStep = this.compute(waterAmount, nozzleDiameter)
                // calculate the progress
                step.progress = (i * this.waterAmountSteps + j) / steps
                list.push(step)
                // fire the next step
                this.subject.next(step)
                // update the water amount
                waterAmount = Math.min(waterAmount + this.config.waterAmountStep, this.waterAmountMaximum)
            }

            // update the nozzle diameter
            nozzleDiameter += this.config.nozzleDiameterStep
        }

        // sort the list after max height and cut for limit
        const result: MultipleSimulationStep[] = list.sort((a: MultipleSimulationStep, b: MultipleSimulationStep) => {
            return b.maxHeight - a.maxHeight
        }).slice(0, this.config.limit)

        return result
    }

}