import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { BackgroundVideoStudioModule } from "./background/background-video-studio.module";
import { VideoStudioComponent } from "./video-studio.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        BackgroundVideoStudioModule
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