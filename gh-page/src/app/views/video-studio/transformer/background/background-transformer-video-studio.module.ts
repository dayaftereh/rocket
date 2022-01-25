import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { SliderModule } from "primeng/slider";
import { BackgroundTransformerVideoStudioComponent } from "./background-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        SliderModule,
        InputTextModule,
        InputSwitchModule,
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