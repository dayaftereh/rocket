import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MessageModule } from 'primeng/message';
import { SerialThrustTestUtilitiesModule } from "./serial/serial-thrust-test-utilities.module";
import { ThrustTestUtilitiesComponent } from "./thrust-test-utilities.component";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        BrowserModule,
        // PrimeNG
        MessageModule,
        //Custom
        SerialThrustTestUtilitiesModule
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