import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LRocketMenuModule } from "lrocket";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { MenuComponent } from "./menu.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        ButtonModule,
        SidebarModule,
        // LRocket
        LRocketMenuModule,
        // Custom
    ],
    declarations: [
        MenuComponent
    ],
    exports: [
        MenuComponent
    ]
})
export class MenuModule {


}