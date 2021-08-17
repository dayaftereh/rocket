import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from "primeng/card";
import { CSVExporterUtilitiesModule } from "../../csv-exporter/csv-exporter-utilities.module";
import { ExportThrustTestUtilitiesComponent } from "./export-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        // Custom
        CSVExporterUtilitiesModule
    ],
    declarations: [
        ExportThrustTestUtilitiesComponent
    ],
    exports: [
        ExportThrustTestUtilitiesComponent
    ]
})
export class ExportThrustTestUtilitiesModule {

}