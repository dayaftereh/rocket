import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { ForegroundsVideoStudioComponent } from "./foregrounds-video-studio.component";
import { ForegroundItemVideoStudioModule } from "./item/foreground-item-video-studio.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        PanelModule,
        ButtonModule,
        DividerModule,
        // Custom
        VideoStudioServiceModule,
        ForegroundItemVideoStudioModule,
    ],
    declarations: [
        ForegroundsVideoStudioComponent
    ],
    exports: [
        ForegroundsVideoStudioComponent
    ]
})
export class ForegroundsVideoStudioModule {

}