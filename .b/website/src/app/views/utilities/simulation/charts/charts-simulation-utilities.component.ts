import { Component } from "@angular/core";
import { SimulationStep } from "../core/simulation-step";
import { ScatterChart } from "./scatter-chart";

@Component({
    selector: 'app-charts-simulation-utilities',
    templateUrl: './charts-simulation-utilities.component.html'
})
export class ChartsSimulationUtilitiesComponent {

    pressure: ScatterChart
    tankVolume: ScatterChart
    flowVelocity: ScatterChart
    massFlowRate: ScatterChart
    thrust: ScatterChart
    mass: ScatterChart
    velocity: ScatterChart
    drag: ScatterChart
    gravity: ScatterChart
    height: ScatterChart

    constructor() {
        this.pressure = new ScatterChart("pressure", "bar")
        this.tankVolume = new ScatterChart("tankVolume", "L")
        this.flowVelocity = new ScatterChart("flowVelocity", "m/s")
        this.massFlowRate = new ScatterChart("massFlowRate", "g/s")
        this.thrust = new ScatterChart("thrust", "N")
        this.velocity = new ScatterChart("velocity", "m/s")
        this.mass = new ScatterChart("mass", "g")
        this.drag = new ScatterChart("drag", "N")
        this.gravity = new ScatterChart("gravity", "N")
        this.height = new ScatterChart("height", "m")
    }

    update(steps: SimulationStep[]): void {
        const pressure: any[] = []
        const tankVolume: any[] = []
        const flowVelocity: any[] = []
        const massFlowRate: any[] = []
        const thrust: any[] = []
        const velocity: any[] = []
        const mass: any[] = []
        const drag: any[] = []
        const gravity: any[] = []
        const height: any[] = []

        steps.forEach((step: SimulationStep) => {
            pressure.push({ x: step.time, y: step.pressure })
            tankVolume.push({ x: step.time, y: step.tankVolume })
            flowVelocity.push({ x: step.time, y: step.flowVelocity })
            massFlowRate.push({ x: step.time, y: step.massFlowRate })
            thrust.push({ x: step.time, y: step.thrust })
            velocity.push({ x: step.time, y: step.velocity })
            mass.push({ x: step.time, y: step.mass })
            drag.push({ x: step.time, y: step.drag })
            gravity.push({ x: step.time, y: step.gravity })
            height.push({ x: step.time, y: step.height })
        })

        this.pressure.update0(pressure)
        this.tankVolume.update0(tankVolume)
        this.flowVelocity.update0(flowVelocity)
        this.massFlowRate.update0(massFlowRate)
        this.thrust.update0(thrust)
        this.velocity.update0(velocity)
        this.mass.update0(mass)
        this.drag.update0(drag)
        this.gravity.update0(gravity)
        this.height.update0(height)
    }

}