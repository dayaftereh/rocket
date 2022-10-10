import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { PreviewTransformerVideoStudioComponent } from "./preview-transformer-video-studio.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        //PrimeNG
        DialogModule,
        ButtonModule,
        //Custom
        VideoStudioServiceModule,
    ],
    declarations: [
        PreviewTransformerVideoStudioComponent
    ],
    exports: [
        PreviewTransformerVideoStudioComponent
    ]
})
export class PreviewTransformerVideoStudioModule {

}