import { Injectable } from "@angular/core";
import * as Comlink from 'comlink';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Constants } from "../../constants/constants";
import { ConstantsService } from "../../constants/constants.service";
import { LocalStorageService } from "../../local-storage/local-storage.service";
import { MultipleSimulationConfig } from "./multiple-simulation-config";
import { MultipleSimulationStep } from "./multiple-simulation-step";
import { MultipleSimulationExecutor } from "./multiple-simulation.executor";

@Injectable()
export class MultipleSimulationService {

    private localStorageKey: string = 'multiple-simulation'

    private worker: Worker
    private executor: MultipleSimulationExecutor

    private running: BehaviorSubject<boolean>
    private steps: Subject<MultipleSimulationStep>
    private config: BehaviorSubject<MultipleSimulationConfig>

    constructor(
        private readonly constantsService: ConstantsService,
        private readonly localStorageService: LocalStorageService
    ) {
        this.steps = new Subject<MultipleSimulationStep>()
        this.running = new BehaviorSubject<boolean>(false)
        this.config = new BehaviorSubject<MultipleSimulationConfig>(this.load())
        this.createWorker()
    }

    private async createWorker(): Promise<void> {
        this.worker = new Worker(new URL('./multiple-simulation.worker', import.meta.url), {
            name: 'MultipleSimulationWorker'
        })
        const ExecutorProxy: any = Comlink.wrap<MultipleSimulationExecutor>(this.worker)
        this.executor = await (new ExecutorProxy())

        this.executor.subscribe(Comlink.proxy(async (step: MultipleSimulationStep) => {
            this.steps.next(step)
        }))
    }

    private load(): MultipleSimulationConfig {
        return this.localStorageService.getObjectOrDefault(
            this.localStorageKey,
            this.defaultConfig()
        )
    }

    defaultConfig(): MultipleSimulationConfig {
        return {
            base: {
                timeStep: 0.01,
                waterAmount: 0.0,
                rocketWeight: 100,
                tankVolume: 2,
                rocketDiameter: 100,
                nozzleDiameter: 0.0,
                initialPressure: 2.5,
                dragCoefficient: 1.0
            },
            nozzleDiameterStep: 1,
            nozzleDiameterMinimum: 4,
            nozzleDiameterMaximum: 10,
            waterAmountStep: 0.01,
            waterAmountMinimum: 0,
            waterAmountMaximum: 10,
            limit: 10
        }
    }

    configAsObservable(): Observable<MultipleSimulationConfig> {
        return this.config.asObservable()
    }

    updateConfig(config: MultipleSimulationConfig): void {
        this.config.next(config)
        this.localStorageService.updateObject(this.localStorageKey, config)
    }

    stepsAsObservable(): Observable<MultipleSimulationStep> {
        return this.steps.asObservable()
    }

    runningAsObservable(): Observable<boolean> {
        return this.running.asObservable()
    }

    async execute(config: MultipleSimulationConfig): Promise<MultipleSimulationStep[]> {
        this.updateConfig(config)

        const constants: Constants = this.constantsService.get()
        try {
            this.running.next(true)

            const result: MultipleSimulationStep[] = await this.executor.compute(constants, config)
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