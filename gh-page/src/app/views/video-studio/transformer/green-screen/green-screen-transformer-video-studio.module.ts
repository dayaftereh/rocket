import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from 'primeng/slider';
import { GreenScreenTransformerVideoStudioComponent } from "./green-screen-transformer-video-studio.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        SliderModule,
        InputSwitchModule,
        SelectButtonModule,
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