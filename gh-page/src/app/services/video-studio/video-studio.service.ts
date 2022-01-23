import { Injectable } from "@angular/core";
import * as Comlink from 'comlink';
import { VideoStudioExecutor } from "./video-studio.executor";

@Injectable()
export class VideoStudioService {

    private worker: Worker | undefined
    private executor: VideoStudioExecutor | undefined

    constructor() {
        this.createWorker()
    }

    private async createWorker(): Promise<void> {
        this.worker = new Worker(new URL('./video-studio.worker', import.meta.url), {
            name: 'VideoStudioWorker'
        })
        const ExecutorProxy: any = Comlink.wrap<VideoStudioExecutor>(this.worker)
        this.executor = await (new ExecutorProxy())
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