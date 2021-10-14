import { Constants } from "../constants/constants";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";
import { SingleSimulationStep } from "./single-simulation-step";

export class SingleSimulation {

    private mass: number
    private time: number
    private height: number
    private velocity: number
    private expelledAirMass: number

    constructor(
        private readonly constants: Constants,
        private readonly config: SingleSimulationConfig
    ) {

    }

    private get emptyRocketMass(): number {
        // kg
        return this.config.rocketWeight / 1000.0
    }

    private get initialWaterVolume0(): number {
        // m3
        return this.config.waterAmount / 1000.0
    }

    private get initialWaterMass0(): number {
        // kg
        return this.initialWaterVolume0 * this.constants.rhoWater
    }

    private get pressureTankVolume(): number {
        // m3
        return this.config.tankVolume / 1000.0
    }

    private get initialPressure0(): number {
        // pa
        return this.config.initialPressure * 100000.0
    }

    private get initialAirVolume0(): number {
        const vL0: number = Math.max(this.pressureTankVolume - this.initialWaterVolume0, 0.0)
        // m3
        return vL0 * Math.pow(this.initialPressure0 / this.constants.pAmb, 1.0 / this.constants.gammaAir)
    }

    private get initialAirMass0(): number {
        // kg
        return this.initialAirVolume0 * this.constants.rhoAir
    }

    private get totalMass0(): number {
        // kg
        return this.emptyRocketMass + this.initialWaterMass0 + this.initialAirMass0
    }

    private get nozzleArea(): number {
        const diameter: number = this.config.nozzleDiameter / 1000.0
        const radius: number = diameter / 2.0
        // m2
        return Math.PI * Math.pow(radius, 2.0)
    }

    private get rocketArea(): number {
        const diameter: number = this.config.rocketDiameter / 1000.0
        const radius: number = diameter / 2.0
        // m2
        return Math.PI * Math.pow(radius, 2.0)
    }

    private get currentWaterVolume(): number {
        return Math.max((this.mass - this.emptyRocketMass - this.initialAirMass0) / this.constants.rhoWater, 0.0)
    }

    private computeWaterThrust(t: number, step: SingleSimulationStep): number {
        // current pressure pa
        const p: number = this.initialPressure0 * Math.pow((this.pressureTankVolume - this.initialWaterVolume0) / (this.pressureTankVolume - this.currentWaterVolume), this.constants.gammaAir)
        // check if still pressure in the tank
        if (p <= this.constants.pAmb) {
            return 0.0
        }
        // water flow velocity m/s
        const vW: number = Math.sqrt((2.0 * (p - this.constants.pAmb)) / this.constants.rhoWater)
        // water mass flow rate kg/s
        const iW: number = this.nozzleArea * vW * this.constants.rhoWater
        // thrust force N
        const force: number = iW * vW
        // remove expelled water from mass
        this.mass -= iW * t

        step.pressure = p / 100000.0
        step.flowVelocity = vW
        step.massFlowRate = iW

        return force
    }

    private computeAirThrust(t: number, step: SingleSimulationStep): number {
        // expelled air volume m3
        const vLa: number = this.expelledAirMass / this.constants.rhoAir
        // current pressure pa
        const p: number = this.initialPressure0 * Math.pow((this.pressureTankVolume - this.initialWaterVolume0) / ((this.pressureTankVolume - this.currentWaterVolume) + vLa), this.constants.gammaAir)
        // check if still pressure in the tank
        if (p <= this.constants.pAmb) {
            return 0.0
        }

        // air flow velocity m/s
        const vL: number = Math.sqrt((2.0 * (p - this.constants.pAmb)) / this.constants.rhoAir)
        // air mass flow rate kg/s
        const iL: number = this.nozzleArea * vL * this.constants.rhoAir //* (p / this.constants.pAmb)
        // thrust force N
        const force: number = iL * vL
        // remove expelled air from mass
        this.mass -= iL * t
        // add to expelled air mass
        this.expelledAirMass += iL * t

        step.pressure = p / 100000.0
        step.flowVelocity = vL
        step.massFlowRate = iL

        return force
    }

    private get gravityForce(): number {
        return this.mass * this.constants.g
    }

    private get dragForce(): number {
        return this.config.dragCoefficient * this.rocketArea * (1.0 / 2.0) * this.constants.rhoAir * Math.pow(this.velocity, 2.0)
    }

    private init(): void {
        this.time = 0.0
        this.height = 0.0
        this.velocity = 0.0
        this.expelledAirMass = 0.0

        this.mass = this.totalMass0
    }

    private tick(t: number): SingleSimulationStep {
        const step: SingleSimulationStep = {
            time: this.time,
            mass: 0.0,
            height: 0.0,
            thrust: 0.0,
            pressure: 0.0,
            velocity: 0.0,
            acceleration: 0.0,
            flowVelocity: 0.0,           
            massFlowRate: 0.0,
        } as SingleSimulationStep

        // N
        let thrust: number = 0.0
        if (this.mass > (this.emptyRocketMass + this.initialAirMass0)) {
            thrust = this.computeWaterThrust(t, step)
        } else if (this.emptyRocketMass < this.mass && this.mass < (this.emptyRocketMass + this.initialAirMass0)) {
            thrust = this.computeAirThrust(t, step)
        }

        // N
        const force: number = thrust - this.gravityForce - this.dragForce
        // m/s2
        step.acceleration = force / this.mass
        // calculate current velocity m/s
        this.velocity += step.acceleration * t
        // calculate current height m/s
        this.height += this.velocity * t

        // update the step
        step.mass = this.mass * 1000.0
        step.thrust = thrust
        step.height = this.height
        step.velocity = this.velocity

        return step
    }

    private computeSteps(): SingleSimulationStep[] {
        const steps: SingleSimulationStep[] = []

        for (let i = 0; i < 10000; i++) {
            // calculate current step
            const step: SingleSimulationStep = this.tick(this.config.timeStep)
            // increment the time
            this.time += this.config.timeStep
            // add the step to list
            steps.push(step)

            // check if the rocket under sea level
            if (step.height < 0.0) {
                return steps
            }
        }

        return steps
    }

    private searchMaxHeight(steps: SingleSimulationStep[]): number {
        let height: number = -Infinity
        steps.forEach((step: SingleSimulationStep) => {
            height = Math.max(step.height, height)
        })
        return height
    }

    execute(): SingleSimulationResult {
        this.init()

        const steps: SingleSimulationStep[] = this.computeSteps()
        const maxHeight: number = this.searchMaxHeight(steps)

        return {
            duration: this.time,
            maxHeight,
            steps
        }
    }

}