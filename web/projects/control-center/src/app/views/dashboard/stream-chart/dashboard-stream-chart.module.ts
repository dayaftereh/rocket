import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DashboardStreamChartComponent } from "./dashboard-stream-chart.component";

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        // Custom
    ],
    declarations: [
        DashboardStreamChartComponent
    ],
    exports: [
        DashboardStreamChartComponent
    ]
})
export class DashboardStreamChartModule {


}