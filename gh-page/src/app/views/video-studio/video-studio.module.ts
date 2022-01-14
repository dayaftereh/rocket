import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { BackgroundVideoStudioModule } from "./background/background-video-studio.module";
import { GreenScreenVideoStudioModule } from "./green-screen/green-screen-video-studio.module";
import { VideoStudioComponent } from "./video-studio.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        BackgroundVideoStudioModule,
        GreenScreenVideoStudioModule,
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