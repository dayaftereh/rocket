import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AnalyzerModule } from "./analyzer/analyzer.module";
import { MenuModule } from "./menu/menu.module";
import { SettingsModule } from "./settings/settings.module";
import { SimulationModule } from "./simulation/simulation.module";
import { UtilitiesModule } from "./utilities/utilities.module";
import { VideoStudioModule } from "./video-studio/video-studio.module";
import { ViewsComponent } from "./views.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        MenuModule,
        SettingsModule,
        AnalyzerModule,
        UtilitiesModule,
        SimulationModule,
        VideoStudioModule
    ],
    declarations: [
        ViewsComponent
    ],
    exports: [
        ViewsComponent
    ]
})
export class ViewsModule {

}