import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ConfigurationModule } from "./configuration/configuration.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { MenuModule } from "./menu/menu.module";
import { ViewsComponent } from "./views.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Custom
        MenuModule,
        DashboardModule,
        ConfigurationModule,
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