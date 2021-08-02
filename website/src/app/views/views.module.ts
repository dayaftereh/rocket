import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { MenuModule } from "./menu/menu.module";
import { SettingsModule } from "./settings/settings.module";
import { UtilitiesModule } from "./utilities/utilities.module";
import { ViewsComponent } from "./views.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        MenuModule,
        SettingsModule,
        UtilitiesModule
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