import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { BackgroundVideoStudioComponent } from "./background-video-studio.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule
    ],
    declarations: [
        BackgroundVideoStudioComponent
    ],
    exports: [
        BackgroundVideoStudioComponent
    ]
})
export class BackgroundVideoStudioModule {

}