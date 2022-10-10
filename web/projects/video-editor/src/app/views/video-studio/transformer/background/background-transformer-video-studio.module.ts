import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { SliderModule } from "primeng/slider";
import { LocalStorageServiceModule } from "src/app/services/local-storage/local-storage-service.module";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { BackgroundTransformerVideoStudioComponent } from "./background-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        PanelModule,
        SliderModule,
        InputTextModule,
        InputSwitchModule,
        // Custom
        VideoStudioServiceModule,
        LocalStorageServiceModule
    ],
    declarations: [
        BackgroundTransformerVideoStudioComponent
    ],
    exports: [
        BackgroundTransformerVideoStudioComponent
    ]
})
export class BackgroundTransformerVideoStudioModule {

}