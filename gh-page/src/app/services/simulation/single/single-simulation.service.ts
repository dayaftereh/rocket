import { Injectable } from "@angular/core";
import * as Comlink from 'comlink';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Constants } from "../../constants/constants";
import { ConstantsService } from "../../constants/constants.service";
import { LocalStorageService } from "../../local-storage/local-storage.service";
import { SingleSimulationConfig } from "./single-simulation-config";
import { SingleSimulationResult } from "./single-simulation-result";
import { SingleSimulationStep } from "./single-simulation-step";
import { SingleSimulationExecutor } from "./single-simulation.executor";

@Injectable()
export class SingleSimulationService {

    private localStorageKey: string = 'single-simulation'

    private worker: Worker
    private executor: SingleSimulationExecutor

    private running: BehaviorSubject<boolean>
    private steps: Subject<SingleSimulationStep>
    private config: BehaviorSubject<SingleSimulationConfig>

    constructor(
        private readonly constantsService: ConstantsService,
        private readonly localStorageService: LocalStorageService
    ) {
        this.steps = new Subject<SingleSimulationStep>()
        this.running = new BehaviorSubject<boolean>(false)
        this.config = new BehaviorSubject<SingleSimulationConfig>(this.load())
        this.createWorker()
    }

    private async createWorker(): Promise<void> {
        console.log(import.meta.url)
        const url: URL = new URL('./single-simulation.worker', import.meta.url)
        console.log(url)
        this.worker = new Worker(url)

        console.log(this.worker)

        const ExecutorProxy: any = Comlink.wrap<SingleSimulationExecutor>(this.worker)

        console.log("before")
        this.executor = await (new ExecutorProxy())
        console.log("after")

        this.executor.subscribe(Comlink.proxy(async (step: SingleSimulationStep) => {
            this.steps.next(step)
        }))

        console.log("Done")
    }

    private load(): SingleSimulationConfig {
        return this.localStorageService.getObjectOrDefault(
            this.localStorageKey,
            this.defaultConfig()
        )
    }

    defaultConfig(): SingleSimulationConfig {
        return {
            timeStep: 0.01,
            waterAmount: 0.66,
            rocketWeight: 100,
            tankVolume: 2,
            rocketDiameter: 100,
            nozzleDiameter: 20,
            initialPressure: 2.5,
            dragCoefficient: 1.0
        }
    }

    configAsObservable(): Observable<SingleSimulationConfig> {
        return this.config.asObservable()
    }

    updateConfig(config: SingleSimulationConfig): void {
        this.config.next(config)
        this.localStorageService.updateObject(this.localStorageKey, config)
    }

    stepsAsObservable(): Observable<SingleSimulationStep> {
        return this.steps.asObservable()
    }

    runningAsObservable(): Observable<boolean> {
        return this.running.asObservable()
    }

    async execute(config: SingleSimulationConfig): Promise<SingleSimulationResult> {
        const constants: Constants = this.constantsService.get()
        try {
            this.running.next(true)

            const result: SingleSimulationResult = await this.executor.compute(constants, config)
            return result
        } finally {
            this.running.next(false)
        }
    }

    async cancel(): Promise<void> {
        // check if a worker has been created
        if (this.worker) {
            // terminate the worker
            this.worker.terminate()
        }
        // create a new worker, because last was canceled
        this.createWorker()
    }
}