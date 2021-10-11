import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ButtonModule } from 'primeng/button';
import { MenuModule as NgMenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { MenuComponent } from "./menu.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        // Primeng
        NgMenuModule,
        ButtonModule,
        SidebarModule,
    ],
    declarations: [
        MenuComponent
    ], exports: [
        MenuComponent
    ]
})
export class MenuModule {

}