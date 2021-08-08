import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MessageModule } from 'primeng/message';
import { ChartsThrustTestUtilitiesModule } from "./charts/charts-thrust-test-utilities.module";
import { ControlThrustTestUtilitiesModule } from "./control/control-thrust-test-utilities.module";
import { ReadingThrustTestUtilitiesModule } from "./reading/reading-thrust-test-utilities.module";
import { RunnerThrustTestUtilitiesModule } from "./runner/runner-thrust-test-utilities.module";
import { SerialThrustTestUtilitiesModule } from "./serial/serial-thrust-test-utilities.module";
import { ThrustTestUtilitiesComponent } from "./thrust-test-utilities.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        //PrimeNG
        MessageModule,
        //Custom
        RunnerThrustTestUtilitiesModule,
        ChartsThrustTestUtilitiesModule,
        SerialThrustTestUtilitiesModule,
        ControlThrustTestUtilitiesModule,
        ReadingThrustTestUtilitiesModule,
    ],
    declarations: [
        ThrustTestUtilitiesComponent
    ],
    exports: [
        ThrustTestUtilitiesComponent
    ]
})
export class ThrustTestUtilitiesModule {

}