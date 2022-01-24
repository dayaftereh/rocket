import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from "primeng/inputswitch";
import { BackgroundTransformerVideoStudioComponent } from "./background-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
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