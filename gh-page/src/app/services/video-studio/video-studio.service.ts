import { Injectable } from "@angular/core";
import * as Comlink from 'comlink';
import { VideoFrame } from "./video-frame";
import { VideoOptions } from "./video-options";
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

    async start(options: VideoOptions): Promise<void> {
        await this.executor.start(options)
    }

    async update(time: number): Promise<void> {
        await this.executor.update(time)
    }

    async frame(frame: VideoFrame): Promise<void> {
        await this.executor.frame(frame)
    }

    async complete(): Promise<string> {
        const url: string = await this.executor.complete()
        return url
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