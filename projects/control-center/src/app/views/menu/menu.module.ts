import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { MenuComponent } from "./menu.component";
import { MenuModule as ngMenuModule } from 'primeng/menu';

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // PrimeNG
        ButtonModule,
        ngMenuModule,
        SidebarModule,
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