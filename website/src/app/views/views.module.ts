import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { SettingsModule } from "./settings/settings.module";
import { ViewsComponent } from "./views.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        SettingsModule
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