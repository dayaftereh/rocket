import { DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ExportThrustTestUtilitiesComponent } from "./export-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        InputTextModule,
    ],
    declarations: [
        ExportThrustTestUtilitiesComponent
    ],
    exports: [
        ExportThrustTestUtilitiesComponent
    ],
    providers: [
        DecimalPipe
    ]
})
export class ExportThrustTestUtilitiesModule {

}