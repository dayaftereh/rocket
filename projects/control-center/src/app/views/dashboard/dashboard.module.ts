import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
        
    ],
    declarations: [
        DashboardComponent
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule {


}