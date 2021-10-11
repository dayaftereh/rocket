import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { Constants } from "../constants/constants";
import { ConstantsService } from "../constants/constants.service";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { SingleSimulation } from "./single-simulation";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";

@Injectable()
export class SimulationService {

    private singleLocalStorageKey: string = 'single-simulation'

    private single: BehaviorSubject<SingleSimulationConfig>

    constructor(
        private readonly constantsService: ConstantsService,
        private readonly localStorageService: LocalStorageService
    ) {
        this.single = new BehaviorSubject<SingleSimulationConfig>(this.load())
    }

    private load(): SingleSimulationConfig {
        return this.localStorageService.getObjectOrDefault(
            this.singleLocalStorageKey,
            this.defaultSingleSimulationConfig()
        )
    }

    defaultSingleSimulationConfig(): SingleSimulationConfig {
        return {
            timeStep: 0.01,
            waterAmount: 0.66,
            rocketWeight: 100,
            bottleVolume: 2,
            bottleDiameter: 100,
            nozzleDiameter: 20,
            initialPressure: 2.5,
            dragCoefficient: 1.0
        }
    }

    singleSimulationConfigAsObservable(): Observable<SingleSimulationConfig> {
        return this.single.pipe(
            share()
        )
    }

    updateSingleSimulationConfig(config: SingleSimulationConfig): void {
        this.single.next(config)
        this.localStorageService.updateObject(this.singleLocalStorageKey, config)
    }

    executeSingle(config: SingleSimulationConfig): SingleSimulationResult {
        this.updateSingleSimulationConfig(config)
        const constants: Constants = this.constantsService.get()
        
        const simulation: SingleSimulation = new SingleSimulation(constants, config)
        const result: SingleSimulationResult = simulation.execute()
        return result
    }

}