/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import { MultipleSimulationExecutor } from './multiple-simulation.executor';
Comlink.expose(MultipleSimulationExecutor)
