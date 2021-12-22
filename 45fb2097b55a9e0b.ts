/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import { SingleSimulationExecutor } from './single-simulation.executor';
console.log("heee");
Comlink.expose(SingleSimulationExecutor);