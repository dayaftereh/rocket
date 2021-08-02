import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Globals } from "../../../../services/globals/globals";
import { GlobalsService } from "../../../../services/globals/globals.service";
import { FormUtils } from "../../../../utils/form-utils";
import { SimulationConfig } from "./simulation-config";

@Component({
    selector: 'app-config-simulation-utilities',
    templateUrl: './config-simulation-utilities.component.html'
})
export class ConfigSimulationUtilitiesComponent {

    formGroup: FormGroup

    @Output()
    config: EventEmitter<SimulationConfig>

    constructor(private readonly globalsService: GlobalsService) {
        this.formGroup = this.create()
        this.config = new EventEmitter<SimulationConfig>(true)
    }

    private create(): FormGroup {
        return new FormGroup({
            rocketWeight: new FormControl(250.0),
            rocketDiameter: new FormControl(45.0),
            tankVolume: new FormControl(2.0),
            tankPressure: new FormControl(6.0),
            nozzleDiameter: new FormControl(0.8),
            thrustNozzleCount: new FormControl(7),
            dragCoefficient: new FormControl(0.77),
            simulationDuration: new FormControl(5.0),
            stepTime: new FormControl(0.01),
            kappa: new FormControl(1.4),
        })
    }

    onSubmit(): void {
        const config: SimulationConfig = this.createSimulationConfig()
        this.config.next(config)
    }

    private createSimulationConfig(): SimulationConfig {
        const rocketWeight: number = FormUtils.getValueOrDefault(this.formGroup, 'rocketWeight', 250)
        const rocketDiameter: number = FormUtils.getValueOrDefault(this.formGroup, 'rocketDiameter', 45)
        const tankVolume: number = FormUtils.getValueOrDefault(this.formGroup, 'tankVolume', 2)
        const tankPressure: number = FormUtils.getValueOrDefault(this.formGroup, 'tankPressure', 6)
        const nozzleDiameter: number = FormUtils.getValueOrDefault(this.formGroup, 'nozzleDiameter', 0.8)
        const thrustNozzleCount: number = FormUtils.getValueOrDefault(this.formGroup, 'thrustNozzleCount', 7)
        const dragCoefficient: number = FormUtils.getValueOrDefault(this.formGroup, 'dragCoefficient', 0.77)
        const simulationDuration: number = FormUtils.getValueOrDefault(this.formGroup, 'simulationDuration', 5)
        const stepTime: number = FormUtils.getValueOrDefault(this.formGroup, 'stepTime', 0.01)
        const kappa: number = FormUtils.getValueOrDefault(this.formGroup, 'kappa', 1.4)

        const globals: Globals = this.globalsService.get()

        return {
            rocketWeight,
            rocketDiameter,
            tankPressure,
            tankVolume,
            nozzleDiameter,
            thrustNozzleCount,
            dragCoefficient,
            globals,
            simulationDuration,
            stepTime,
            kappa
        }
    }

}