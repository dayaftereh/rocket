import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { ForegroundItemVideoStudioComponent } from "./foreground-item-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputSwitchModule,
        InputTextareaModule,
        // Custom
        VideoStudioServiceModule
    ],
    declarations: [
        ForegroundItemVideoStudioComponent
    ],
    exports: [
        ForegroundItemVideoStudioComponent
    ]
})
export class ForegroundItemVideoStudioModule {

}