import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { GreenScreenVideoStudioComponent } from "./green-screen-video-studio.component";

@NgModule({
    imports: [
        // angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        SliderModule,
        FileUploadModule,
        InputSwitchModule,
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