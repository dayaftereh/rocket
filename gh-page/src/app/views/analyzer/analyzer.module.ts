import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { FileUploadModule } from 'primeng/fileupload';
import { ChartJsModule } from "../chartjs/chartjs.module";
import { AnalyzerComponent } from "./analyzer.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        HttpClientModule,
        // Primeng
        CardModule,
        ChartModule,
        ButtonModule,
        FileUploadModule,
        // ChartJS
        ChartJsModule,
    ],
    declarations: [
        AnalyzerComponent
    ],
    exports: [
        AnalyzerComponent
    ]
})
export class AnalyzerModule {

}