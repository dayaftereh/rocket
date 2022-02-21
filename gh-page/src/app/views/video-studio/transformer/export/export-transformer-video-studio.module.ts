import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { LocalStorageServiceModule } from "src/app/services/local-storage/local-storage-service.module";
import { VideoStudioServiceModule } from "src/app/services/video-studio/video-studio-service.module";
import { ExportTransformerVideoStudioComponent } from "./export-transformer-video-studio.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        //PrimeNG
        PanelModule,
        InputTextModule,
        // Custom
        VideoStudioServiceModule,
        LocalStorageServiceModule,
    ],
    declarations: [
        ExportTransformerVideoStudioComponent
    ],
    exports: [
        ExportTransformerVideoStudioComponent
    ]
})
export class ExportTransformerVideoStudioModule {

}