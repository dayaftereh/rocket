import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FileUploadModule } from 'primeng/fileupload';
import { MediaTransformerVideoStudioComponent } from "./media-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        FileUploadModule,
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