import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { saveAs } from "file-saver";
import { VideoBackgroundOptions } from "src/app/services/video-studio/background/video-background-options";
import { VideoFrame } from "src/app/services/video-studio/video-frame";
import { VideoGreenScreenOptions } from "src/app/services/video-studio/video-green-screen-options";
import { VideoInformation } from "src/app/services/video-studio/video-information";
import { VideoOptions } from "src/app/services/video-studio/video-options";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { BackgroundTransformerVideoStudioComponent } from "./background/background-transformer-video-studio.component";
import { GreenScreenTransformerVideoStudioComponent } from "./green-screen/green-screen-transformer-video-studio.component";
import { MediaTransformerVideoStudioComponent } from "./media/media-transformer-video-studio.component";

@Component({
    templateUrl: "./transformer-video-studio.component.html"
})
export class TransformerVideoStudioComponent implements AfterViewInit {

    @ViewChild("media")
    media: MediaTransformerVideoStudioComponent | undefined

    @ViewChild("background")
    background: BackgroundTransformerVideoStudioComponent | undefined

    @ViewChild("greenScreen")
    greenScreen: GreenScreenTransformerVideoStudioComponent | undefined

    private lastFrame: VideoFrame | undefined

    constructor(private readonly videoStudioService: VideoStudioService) {

    }

    ngAfterViewInit(): void {
        this.media.onFrame = async (frame: VideoFrame) => {
            await this.onFrame(frame)
        }
    }

    private async onFrame(frame: VideoFrame): Promise<void> {
        await this.videoStudioService.frame(frame)
        if (this.lastFrame) {
            const time: number = frame.time - this.lastFrame.time
            await this.videoStudioService.update(time)
        }
        this.lastFrame = frame
    }

    async onFinished(): Promise<void> {
        const blopUrl: string = await this.videoStudioService.complete()
        saveAs(blopUrl, "out.webm")
    }

    async start(): Promise<void> {
        const backgroundOptions: VideoBackgroundOptions = this.background.getOptions()
        const greenScreenOptions: VideoGreenScreenOptions = this.greenScreen.getOptions()

        const videoInfo: VideoInformation = this.media.getInformation()

        const options: VideoOptions = {
            foregrounds: [],
            background: backgroundOptions,
            greenScreen: greenScreenOptions,

            information: videoInfo,

            x: 0,
            y: 0,
        }

        this.lastFrame = undefined

        await this.videoStudioService.start(options)

        this.media.play()
    }

    cancel(): void {
        this.videoStudioService.cancel()
        if (this.media) {
            this.media.pause()
        }
    }
}