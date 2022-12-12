import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DashboardControlsComponent } from "./dashboard-controls.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
    ],
    declarations: [
        DashboardControlsComponent
    ],
    exports: [
        DashboardControlsComponent
    ]
})
export class DashboardControlsModule {


}