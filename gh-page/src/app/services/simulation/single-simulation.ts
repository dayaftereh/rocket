import { Constants } from "../constants/constants";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";
import { SingleSimulationStep } from "./single-simulation-step";

export class SingleSimulation {

    private mass: number
    private time: number
    private height: number
    private velocity: number
    private airMassOutputted: number

    constructor(
        private readonly constants: Constants,
        private readonly config: SingleSimulationConfig
    ) {

    }

    private get rocketEmptyMass(): number {
        return this.config.rocketWeight / 1000.0
    }

    private get waterVolume0(): number {
        // liter to m3
        return this.config.waterAmount / 1000.0
    }

    private get waterMass0(): number {
        return this.waterVolume0 * this.constants.rhoWater
    }

    private get bottleVolume0(): number {
        // liter to m3
        return this.config.bottleVolume / 1000.0
    }

    private get pressure0(): number {
        // bar to pascal
        return this.config.initialPressure * 100000.0
    }

    private get airMass0(): number {
        const v1: number = (this.bottleVolume0 - this.waterVolume0) * Math.pow((this.pressure0 / this.constants.pAmb), 1.0 / this.constants.k)
        return v1 * this.constants.rhoAir
    }

    private get mass0(): number {
        return this.rocketEmptyMass + this.waterMass0 + this.airMass0
    }

    private get waterVolume(): number {
        return (this.mass - this.rocketEmptyMass - this.airMass0) / this.constants.rhoWater
    }

    private get waterPressure(): number {
        return this.pressure0 * Math.pow((this.bottleVolume0 - this.waterVolume0) / (this.bottleVolume0 - this.waterVolume), this.constants.k)
    }

    private get waterFlowVelocity(): number {
        const p: number = this.waterPressure
        if (p < this.constants.pAmb) {
            return 0.0
        }

        return Math.sqrt(2.0 * (p - this.constants.pAmb) / this.constants.rhoWater)
    }

    private get airVolumeOutputted(): number {
        return this.airMassOutputted / this.constants.rhoAir
    }

    private get airPressure(): number {
        return this.pressure0 * Math.pow((this.bottleVolume0 - this.waterVolume0) / ((this.bottleVolume0 - this.waterVolume) + this.airVolumeOutputted), this.constants.k)
    }

    private get airFlowVelocity(): number {
        const p: number = this.airPressure
        if (p < this.constants.pAmb) {
            return 0.0
        }

        return Math.sqrt(2.0 * (p - this.constants.pAmb) / this.constants.rhoAir)
    }

    private get nozzleArea(): number {
        // mm to m
        const diameter: number = this.config.nozzleDiameter / 1000.0
        const radius: number = (diameter / 2.0)
        return Math.PI * Math.pow(radius, 2.0)
    }

    private get rocketArea(): number {
        // mm to m
        const diameter: number = this.config.bottleDiameter / 1000.0
        const radius: number = (diameter / 2.0)
        return Math.PI * Math.pow(radius, 2.0)
    }

    private get waterMassFlowRate(): number {
        // check if still water left
        if (this.mass <= (this.rocketEmptyMass + this.airMass0)) {
            return 0.0
        }
        return this.nozzleArea * this.waterFlowVelocity * this.constants.rhoWater
    }

    private get airMassFlowRate(): number {
        // check if still air left
        if (this.mass > (this.rocketEmptyMass + this.airMass0)) {
            return 0.0
        }
        if (this.mass < this.rocketEmptyMass) {
            return 0.0
        }

        return this.nozzleArea * this.airFlowVelocity * this.constants.rhoAir
    }

    private get drag(): number {
        return this.config.dragCoefficient * this.rocketArea * (1.0 / 2.0) * this.constants.rhoAir * Math.pow(this.velocity, 2.0)
    }

    private get gravity(): number {
        // kg * m / s2 = N
        return this.mass * this.constants.g
    }

    private next(tick: number): SingleSimulationStep {
        const airFlowVelocity: number = this.airFlowVelocity // m/s       
        const airMassFlowRate: number = this.airMassFlowRate  // kg/s

        console.log(airFlowVelocity, airMassFlowRate)

        const waterFlowVelocity: number = this.waterFlowVelocity // m/s
        const waterMassFlowRate: number = this.waterMassFlowRate  // kg/s

        // update the masses
        this.mass -= (airMassFlowRate + waterMassFlowRate) * tick
        this.airMassOutputted += airMassFlowRate * tick

        // m/s * kg/s = kg*m / s2 = N
        const forceAir: number = airMassFlowRate * (airFlowVelocity - this.velocity)
        const forceWater: number = waterMassFlowRate * (waterFlowVelocity - this.velocity)

        const force: number = (forceAir + forceWater) - this.gravity - this.drag
        const acceleration: number = force / this.mass

        this.velocity += acceleration * tick
        this.height += this.velocity * tick

        const step: SingleSimulationStep = {
            mass: this.mass,
            time: this.time,
            height: this.height,
            velocity: this.velocity
        }

        return step
    }

    private compute(): SingleSimulationStep[] {
        const steps: SingleSimulationStep[] = []

        for (let i = 0; i < 10000; i++) {
            // compute the next step
            const step: SingleSimulationStep = this.next(this.config.timeStep)
            steps.push(step)

            if (step.height < 0.0) {
                return steps
            }

            this.time += this.config.timeStep
        }

        return steps
    }

    private findMaxHeight(steps: SingleSimulationStep[]): number {
        let height: number = -Infinity
        steps.forEach((step: SingleSimulationStep) => {
            height = Math.max(height, step.height)
        })

        return height
    }

    execute(): SingleSimulationResult {
        this.time = 0.0
        this.height = 0.0
        this.velocity = 0.0
        this.airMassOutputted = 0.0

        this.mass = this.mass0

        const steps: SingleSimulationStep[] = this.compute()
        const maxHeight: number = this.findMaxHeight(steps)

        return {
            duration: this.time,
            maxHeight,
            steps
        }
    }

}