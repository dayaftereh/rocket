import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from "primeng/inputtext";
import { SliderModule } from 'primeng/slider';
import { LocalStorageServiceModule } from "src/app/services/local-storage/local-storage-service.module";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { MediaTransformerVideoStudioComponent } from "./media-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        SliderModule,
        DropdownModule,
        InputTextModule,
        FileUploadModule,
        // Custom
        VideoStudioServiceModule,
        LocalStorageServiceModule,
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