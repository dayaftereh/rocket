import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { BackgroundTransformerVideoStudioModule } from "./background/background-transformer-video-studio.module";
import { GreenScreenTransformerVideoStudioModule } from "./green-screen/green-screen-transformer-video-studio.module";
import { TransformerVideoStudioComponent } from "./transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        //Custom
        VideoStudioServiceModule,
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