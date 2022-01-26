import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FileUploadModule } from 'primeng/fileupload';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { MediaTransformerVideoStudioComponent } from "./media-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        FileUploadModule,
        // Custom
        VideoStudioServiceModule
    ],
    declarations: [
        MediaTransformerVideoStudioComponent
    ],
    exports: [
        MediaTransformerVideoStudioComponent
    ]
})
export class MediaTransformerVideoStudioModule {

}