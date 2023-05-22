import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ConfigurationRocketComponent } from "./configuration-rocket.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
    ],
    declarations: [
        ConfigurationRocketComponent
    ],
    exports: [
        ConfigurationRocketComponent
    ]
})
export class ConfigurationRocketModule {


}