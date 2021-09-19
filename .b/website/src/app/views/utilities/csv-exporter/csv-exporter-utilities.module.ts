import { DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CSVExporterUtilitiesComponent } from "./csv-exporter-utilities.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        //PrimeNG
        ButtonModule,
        DropdownModule,
        InputTextModule,
    ],
    declarations: [
        CSVExporterUtilitiesComponent
    ],
    exports: [
        CSVExporterUtilitiesComponent
    ],
    providers: [
        DecimalPipe
    ]
})
export class CSVExporterUtilitiesModule {

}