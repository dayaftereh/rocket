/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import { SingleSimulationExecutor } from './single-simulation.executor';
Comlink.expose(SingleSimulationExecutor)
