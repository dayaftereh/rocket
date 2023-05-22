import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ConfigurationComponent } from "./configuration.component";
import { ConfigurationLaunchPadModule } from "./launch-pad/configuration-launch-pad.module";
import { ConfigurationRocketModule } from "./rocket/configuration-rocket.module";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
        ConfigurationRocketModule,
        ConfigurationLaunchPadModule,
    ],
    declarations: [
        ConfigurationComponent
    ],
    exports: [
        ConfigurationComponent
    ]
})
export class ConfigurationModule {


}