import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from "primeng/inputtext";
import { SelectButtonModule } from 'primeng/selectbutton';
import { SimulationModelThrustTestUtilitiesComponent } from "./simulation-model-thrust-test-utilities.component";

@NgModule({
    imports: [
        //Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        CardModule,
        ButtonModule,
        InputTextModule,
        InputSwitchModule,
        SelectButtonModule,
    ],
    declarations: [
        SimulationModelThrustTestUtilitiesComponent
    ],
    exports: [
        SimulationModelThrustTestUtilitiesComponent
    ]
})
export class SimulationModelThrustTestUtilitiesModule {

}