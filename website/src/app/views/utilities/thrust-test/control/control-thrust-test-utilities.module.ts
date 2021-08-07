import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ControlThrustTestUtilitiesComponent } from "./control-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        InputTextModule,
    ],
    declarations: [
        ControlThrustTestUtilitiesComponent
    ],
    exports: [
        ControlThrustTestUtilitiesComponent
    ]
})
export class ControlThrustTestUtilitiesModule {

}