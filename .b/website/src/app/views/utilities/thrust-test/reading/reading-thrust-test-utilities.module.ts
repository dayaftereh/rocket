import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ReadingThrustTestUtilitiesComponent } from "./reading-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        FormsModule,
        BrowserModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        InputTextModule,
    ],
    declarations: [
        ReadingThrustTestUtilitiesComponent
    ],
    exports: [
        ReadingThrustTestUtilitiesComponent
    ]
})
export class ReadingThrustTestUtilitiesModule {

}