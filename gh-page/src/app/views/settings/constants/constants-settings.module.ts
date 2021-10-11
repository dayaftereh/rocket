import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ConstantsServiceModule } from "../../../services/constants/constants-service.module";
import { ConstantsSettingsComponent } from "./constants-settings.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // Primeng
        CardModule,
        InputTextModule,
        // Custom
        ConstantsServiceModule
    ],
    declarations: [
        ConstantsSettingsComponent
    ],
    exports: [
        ConstantsSettingsComponent
    ]
})
export class ConstantsSettingsModule {

}