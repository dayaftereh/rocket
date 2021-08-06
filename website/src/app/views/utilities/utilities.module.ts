import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { SimulationUtilitiesModule } from "./simulation/simulation-utilities.module";
import { ThrustTestUtilitiesModule } from "./thrust-test/thrust-test-utilities.module";
import { UtilitiesComponent } from "./utilities.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        ThrustTestUtilitiesModule,
        SimulationUtilitiesModule
    ],
    declarations: [
        UtilitiesComponent
    ],
    exports: [
        UtilitiesComponent
    ]
})
export class UtilitiesModule {

}