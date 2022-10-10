import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from "primeng/panel";
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from 'primeng/slider';
import { LocalStorageServiceModule } from "src/app/services/local-storage/local-storage-service.module";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { GreenScreenTransformerVideoStudioComponent } from "./green-screen-transformer-video-studio.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        PanelModule,
        ButtonModule,
        SliderModule,
        InputSwitchModule,
        SelectButtonModule,
        OverlayPanelModule,
        // Custom
        VideoStudioServiceModule,
        LocalStorageServiceModule,
    ],
    declarations: [
        GreenScreenTransformerVideoStudioComponent
    ],
    exports: [
        GreenScreenTransformerVideoStudioComponent
    ]
})
export class GreenScreenTransformerVideoStudioModule {

}