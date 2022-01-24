import { Component } from "@angular/core";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";

@Component({
    templateUrl: "./transformer-video-studio.component.html"
})
export class TransformerVideoStudioComponent {

    constructor(private readonly videoStudioService: VideoStudioService) {

    }

}