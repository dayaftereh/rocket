import { NgModule } from "@angular/core";
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

@NgModule({
})
export class ChartJsModule {

    constructor() {
        Chart.register(zoomPlugin)
    }

}