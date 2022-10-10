import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { Chart } from 'chart.js';
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { DropdownModule } from "primeng/dropdown";
import { LRocketChartComponent } from "./lrocket-chart.component";

import "chartjs-adapter-moment";
import "moment";

import Annotation from "chartjs-plugin-annotation";
import ChartStreaming from "chartjs-plugin-streaming";
import Zoom from "chartjs-plugin-zoom";

@NgModule({
    imports: [
        // Angular
        FormsModule,
        CommonModule,
        //PrimeNG
        ChartModule,
        ButtonModule,
        DropdownModule,
        // ngx-translate
        TranslateModule,
    ],
    exports: [
        //PrimeNG
        ChartModule,
        // custom,
        LRocketChartComponent
    ],
    declarations: [
        LRocketChartComponent
    ]
})
export class ChartJsModule {

    constructor() {
        Chart.register(Zoom)
        Chart.register(Annotation)
        Chart.register(ChartStreaming)
    }

}