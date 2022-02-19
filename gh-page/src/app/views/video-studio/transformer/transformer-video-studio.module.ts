import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { BackgroundTransformerVideoStudioModule } from "./background/background-transformer-video-studio.module";
import { ForegroundsVideoStudioModule } from "./foregrounds/foregrounds-video-studio.module";
import { GreenScreenTransformerVideoStudioModule } from "./green-screen/green-screen-transformer-video-studio.module";
import { MediaTransformerVideoStudioModule } from "./media/media-transformer-video-studio.module";
import { TransformerVideoStudioComponent } from "./transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        ButtonModule,
        //Custom
        VideoStudioServiceModule,
        ForegroundsVideoStudioModule,
        MediaTransformerVideoStudioModule,
        BackgroundTransformerVideoStudioModule,
        GreenScreenTransformerVideoStudioModule,
    ],
    declarations: [
        TransformerVideoStudioComponent
    ],
    exports: [
        TransformerVideoStudioComponent
    ]
})
export class TransformerVideoStudioModule {
}