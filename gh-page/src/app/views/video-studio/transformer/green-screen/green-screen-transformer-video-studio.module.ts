import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from 'primeng/slider';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { GreenScreenTransformerVideoStudioComponent } from "./green-screen-transformer-video-studio.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        SliderModule,
        InputSwitchModule,
        SelectButtonModule,
        OverlayPanelModule,
        // Custom
        VideoStudioServiceModule
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