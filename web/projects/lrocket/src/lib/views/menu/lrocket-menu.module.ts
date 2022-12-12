import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { LRocketMenuItemComponent } from "./lrocket-menu-item.component";
import { LRocketMenuComponent } from "./lrocket-menu.component";

@NgModule({
    imports: [
        // Angular
        RouterModule,
        BrowserModule,
        //PrimeNG
        CardModule,
        SharedModule,
        ButtonModule,
        // ngx-translate
        TranslateModule,
    ],
    declarations: [
        LRocketMenuComponent,
        LRocketMenuItemComponent,
    ],
    exports: [
        SharedModule,
        LRocketMenuComponent,
        LRocketMenuItemComponent
    ],
})
export class LRocketMenuModule {

}