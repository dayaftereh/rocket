import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SliderModule } from 'primeng/slider';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { MediaTransformerVideoStudioComponent } from "./media-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        SliderModule,
        DropdownModule,
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