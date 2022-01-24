/// <reference lib="webworker" />
/// <reference lib="ES2015" />
import * as Comlink from 'comlink';
import { VideoStudioExecutor } from './video-studio.executor';
Comlink.expose(VideoStudioExecutor)