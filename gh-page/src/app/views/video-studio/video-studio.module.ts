import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TransformerVideoStudioModule } from "./transformer/transformer-video-studio.module";
import { VideoStudioComponent } from "./video-studio.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom       
        TransformerVideoStudioModule
    ],
    declarations: [
        VideoStudioComponent
    ],
    exports: [
        VideoStudioComponent
    ]
})
export class VideoStudioModule {

}