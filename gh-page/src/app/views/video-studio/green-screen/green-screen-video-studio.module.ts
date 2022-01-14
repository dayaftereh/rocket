import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { SliderModule } from 'primeng/slider';
import { GreenScreenVideoStudioComponent } from "./green-screen-video-studio.component";

@NgModule({
    imports: [
        // angular
        BrowserModule,
        // PrimeNG
        CardModule,
        SliderModule,
        FileUploadModule,
        ColorPickerModule,
    ],
    declarations: [
        GreenScreenVideoStudioComponent
    ],
    exports: [
        GreenScreenVideoStudioComponent
    ]
})
export class GreenScreenVideoStudioModule { }