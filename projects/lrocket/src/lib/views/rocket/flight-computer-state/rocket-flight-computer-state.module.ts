import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { DropdownModule } from "primeng/dropdown";
import { RocketFlightComputerStateComponent } from "./rocket-flight-computer-state.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // PrimeNG
        DropdownModule,
        // ngx-translate
        TranslateModule,
    ],
    declarations: [
        RocketFlightComputerStateComponent
    ],
    exports: [
        RocketFlightComputerStateComponent
    ]
})
export class RocketFlightComputerStateModule {

}