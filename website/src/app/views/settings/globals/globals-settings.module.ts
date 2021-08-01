import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalsServiceModule } from "../../../services/globals/globals-service.module";
import { GlobalsSettingsComponent } from "./globals-settings.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        ReactiveFormsModule,
        // Primeng
        CardModule,
        InputTextModule,
        // Custom
        GlobalsServiceModule
    ],
    declarations: [
        GlobalsSettingsComponent
    ],
    exports: [
        GlobalsSettingsComponent
    ]
})
export class GlobalsSettingsModule {

}