import { SimulationConfig } from "../config/simulation-config";
import { SimulationStep } from "./simulation-step";

export class SimulationCalculator {

    private height: number
    private velocity: number // in m/s
    private airVolume: number // in m3
    private outputtedAir: number // in m3

    constructor(private readonly config: SimulationConfig) {
        this.height = 0.0
        this.velocity = 0.0
        this.airVolume = 0.0
        this.outputtedAir = 0.0
    }

    private get tankVolume0(): number {
        return this.config.tankVolume / 1000.0
    }

    private get tankPressure0(): number {
        return this.config.tankPressure * 100000.0
    }

    private init(): void {
        this.height = 0.0
        this.velocity = 0.0
        this.outputtedAir = 0.0
        // calculate start air volume
        this.airVolume = this.tankVolume0 * Math.pow(this.tankPressure0 / this.config.globals.pAmb, 1.0 / this.config.kappa) - this.tankVolume0
    }

    run(): SimulationStep[] {
        this.init()

        let time: number = 0.0
        const steps: SimulationStep[] = []
        while (time <= this.config.simulationDuration) {
            const step: SimulationStep = this.step(time, this.config.stepTime)
            steps.push(step)
            time += this.config.stepTime
        }

        return steps
    }

    private get pressure(): number {
        return this.tankPressure0 * Math.pow(this.tankVolume0 / (this.tankVolume0 + this.outputtedAir), this.config.kappa)
    }

    private get flowVelocity(): number {
        if (this.pressure <= this.config.globals.pAmb) {
            return 0.0
        }
        const e: number = (2.0 * (this.pressure - this.config.globals.pAmb)) / this.config.globals.rhoAir
        if (e < 0.0) {
            return 0.0
        }
        return Math.sqrt(e)
    }

    private get nozzleCrossSectionalArea(): number {
        const r: number = (this.config.nozzleDiameter / 1000.0) / 2.0
        const a: number = Math.PI * (r * r)
        return a * this.config.thrustNozzleCount
    }

    private get massFlowRate(): number {
        return this.nozzleCrossSectionalArea * this.flowVelocity * this.config.globals.rhoAir * (this.pressure / this.config.globals.pAmb)

    }

    private get thrust(): number {
        return this.flowVelocity * this.massFlowRate
    }

    private get tankVolume(): number {
        return this.airVolume - this.outputtedAir
    }

    private get mass(): number {
        const w: number = this.config.rocketWeight / 1000.0
        const v: number = this.tankVolume * this.config.globals.rhoAir
        return w + v
    }

    private get gravityForce(): number {
        return this.mass * this.config.globals.g
    }

    private get dragForce(): number {
        const r: number = (this.config.nozzleDiameter / 1000.0) / 2.0
        const a: number = Math.PI * (r * r)
        const v2: number = Math.abs(this.velocity) * this.velocity
        return this.config.dragCoefficient * a * (1.0 / 2.0) * this.config.globals.rhoAir * v2
    }

    private get acceleration(): number {
        const force: number = this.thrust - (this.gravityForce + this.dragForce)
        return force / this.mass
    }

    private step(time: number, delta: number): SimulationStep {
        const step: SimulationStep = {
            time,
            mass: this.mass * 1000.0, // in g
            velocity: this.velocity, // in m/s
            height: this.height, // in m
            tankVolume: this.tankVolume * 1000.0, // in L
            pressure: this.pressure / 100000.0, // in bar
            flowVelocity: this.flowVelocity, // in m/s
            massFlowRate: this.massFlowRate * 1000.0, // in g/s
            thrust: this.thrust,// in N
            drag: this.dragForce, // in N
            gravity: this.gravityForce, // in N
        } as SimulationStep

        this.velocity += this.acceleration * delta
        this.height += this.velocity * delta
        this.outputtedAir = Math.max(this.outputtedAir + ((this.massFlowRate * delta) / this.config.globals.rhoAir), 0.0)

        return step

    }

}