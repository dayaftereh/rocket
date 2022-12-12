import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ConfigurationLaunchPadComponent } from "./configuration-launch-pad.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
    ],
    declarations: [
        ConfigurationLaunchPadComponent
    ],
    exports: [
        ConfigurationLaunchPadComponent
    ]
})
export class ConfigurationLaunchPadModule {


}