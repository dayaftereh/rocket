import { Injectable } from "@angular/core";
import * as Comlink from 'comlink';
import { saveAs } from "file-saver";
import { Observable, Subject } from "rxjs";
import { VideoBackgroundOptions } from "./background/video-background-options";
import { VideoExport } from "./video-export";
import { VideoForegroundItem } from "./video-foreground-item";
import { VideoFrame } from "./video-frame";
import { VideoGreenScreenOptions } from "./video-green-screen-options";
import { VideoMeta } from "./video-meta";
import { VideoOutput } from "./video-output";
import { VideoStudioExecutor } from "./video-studio.executor";

@Injectable()
export class VideoStudioService {

    private promise: Promise<VideoStudioExecutor>
    private worker: Worker | undefined
    private executor: VideoStudioExecutor | undefined

    private _done: Subject<void>
    private _next: Subject<void>
    private _frame: Subject<void>

    constructor() {
        this._done = new Subject<void>()
        this._next = new Subject<void>()
        this._frame = new Subject<void>()
    }

    async createOrGetExecutor(): Promise<VideoStudioExecutor> {
        if (!!this.promise) {
            return this.promise
        }

        this.promise = new Promise(async resolve => {
            // create the web worker
            this.worker = new Worker(new URL('./video-studio.worker', import.meta.url), {
                name: 'VideoStudioWorker'
            })

            // wrap the worker with Comlink.js
            const ExecutorProxy: any = Comlink.wrap<VideoStudioExecutor>(this.worker)
            this.executor = await (new ExecutorProxy())

            resolve(this.executor)
        })

        return this.promise
    }

    async setVideoExport(videoExport: VideoExport): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setVideoExport(videoExport)
    }

    async setFrame(frame: VideoFrame): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setFrame(frame)
        this._frame.next()
    }

    async renderFrame(): Promise<VideoFrame | undefined> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        const frame: VideoFrame | undefined = await executor.renderFrame()
        return frame
    }

    async setGreenScreen(greenScreen: VideoGreenScreenOptions | undefined): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setGreenScreen(greenScreen)
    }

    async setBackground(background: VideoBackgroundOptions | undefined): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setBackground(background)
    }

    async setForegrounds(foregrounds: VideoForegroundItem[]): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setForegrounds(foregrounds)
    }

    async setVideoMeta(videoMeta: VideoMeta): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.setVideoMeta(videoMeta)
    }

    async greenScreen(): Promise<VideoFrame | undefined> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        const frame: VideoFrame = await executor.greenScreen()
        return frame
    }

    async cancel(): Promise<void> {
        // check if a worker has been created
        if (this.worker) {
            // terminate the worker
            this.worker.terminate()
        }
        this.promise = undefined
        this.worker = undefined
        this.executor = undefined
    }

    async next(): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        await executor.next()
        this._next.next()
    }

    nextAsObservable(): Observable<void> {
        return this._next
    }

    frameAsObservable(): Observable<void> {
        return this._frame
    }

    doneAsObservable(): Observable<void> {
        return this._done
    }

    async done(): Promise<void> {
        const executor: VideoStudioExecutor = await this.createOrGetExecutor()
        const output: VideoOutput = await executor.done()
        saveAs(output.url, output.filename)

        this._done.next()
    }

}