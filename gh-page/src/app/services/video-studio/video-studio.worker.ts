/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import { VideoStudioExecutor } from './video-studio.executor';
Comlink.expose(VideoStudioExecutor)