import { Subject } from "rxjs";

export class LRocketChart {

    data: any;
    options: any;
    plugins: any;

    onRefresh: Subject<void>;

    constructor() {
        this.data = {};
        this.options = {};
        this.plugins = {};
        this.onRefresh = new Subject<void>();
    }

    static get zoomModes(): string[] {
        return ["x", "y", "xy"];
    }

    protected createDataset(label: string, color?: string, xAxisID?: string, yAxisID?: string): any {
        return {
            label,
            data: [],
            fill: false,
            showLine: true,
            lineTension: 0,
            borderWidth: this.borderWidth,
            pointRadius: 0,
            borderColor: color,
            xAxisID,
            yAxisID,
        };
    }

    protected createBarDataset(label: string, color?: string, xAxisID?: string, yAxisID?: string): any {
        return {
            label,
            data: [],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            xAxisID,
            yAxisID,
            barThickness: "flex",
            barPercentage: 0.9,
            categoryPercentage: 1.0,
        };
    }

    protected createLineAnnotation(color: string, label?: string, xAxisID?: string, yAxisID?: string): any {
        return {
            type: "line",
            borderColor: color,
            borderWidth: 1,
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0,
            display: true,
            xScaleID: xAxisID,
            yScaleID: yAxisID,
            label: {
                content: label,
                color: this.labelFont,
                enabled: label !== undefined && label !== null,
                backgroundColor: `rgba(0,0,0,0.6)`,
            },
        };
    }

    protected setLineAnnotationPoints(annotation: any, x1: number, y1: number, x2: number, y2: number): void {
        annotation.xMin = x1;
        annotation.yMin = y1;
        annotation.xMax = x2;
        annotation.yMax = y2;
    }

    protected get borderWidth(): number {
        return 2;
    }

    protected get frameRate(): number {
        return 25;
    }

    protected get fontSize(): number {
        return 12;
    }

    protected get labelFont(): string {
        return "#ebedef";
    }

    protected get timePattern(): string {
        return "hh:mm:ss";
    }

    protected createLinearAxis(axis: string, title?: string): any {
        return {
            axis,
            type: "linear",
            stacked: false,
            ticks: {
                sampleSize: 5,
                color: "#ebedef",
                font: {
                    size: this.fontSize,
                },
            },
            grid: {
                color: "rgba(255,255,255,0.2)",
            },
            title: {
                text: title,
                color: this.labelFont,
                display: title !== undefined && title !== null,
            },
        };
    }

    protected get spanGaps(): boolean {
        return true;
    }

    protected createDefaultPlugins(): any {
        return {
            autocolors: false,
        };
    }

    protected createDefaultOptions(parent: any): any {
        return Object.assign(
            {},
            {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: this.fontSize,
                            },
                            color: "#ebedef",
                        },
                    },
                    annotation: {
                        annotations: {},
                    },
                },
                animation: false,
                spanGaps: this.spanGaps,
            },
            parent
        );
    }

    protected injectAnnotations(options: any, annotations: any): any {
        if (!options.plugins) {
            options.plugins = {};
        }

        if (!options.plugins.annotation) {
            options.plugins.annotation = {};
        }

        if (!options.plugins.annotation.annotations) {
            options.plugins.annotation.annotations = {};
        }

        options.plugins.annotation.annotations = Object.assign(
            {},
            options.plugins.annotation.annotations,
            annotations
        );

        return options;
    }

    protected injectZoom(options: any, pan?: string, zoom?: string): any {
        if (!options.plugins) {
            options.plugins = {};
        }

        if (!options.plugins.zoom) {
            options.plugins.zoom = {};
        }

        if (!!pan) {
            options.plugins.zoom.pan = {
                mode: pan,
                enabled: true,
            };
        }

        if (!!zoom) {
            options.plugins.zoom.zoom = {
                mode: zoom,
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
            };
        }

        if (!options.transitions) {
            options.transitions = {};
        }

        options.transitions.zoom = {
            zoom: {
                animation: {
                    duration: 0,
                },
            },
        };

        return options;
    }

    protected createRealtimeAxis(axis: string, duration: number, refresh?: number): any {
        const baseAxis: any = this.createLinearAxis(axis);
        baseAxis.type = "realtime";

        if (refresh == undefined || refresh === null) {
            refresh = 500;
        }

        baseAxis.time = {
            displayFormats: {
                hour: this.timePattern,
                second: this.timePattern,
                minute: this.timePattern,
            },
        };

        baseAxis.ticks.source = 10.0;
        baseAxis.ticks.maxRotation = 0.0;
        baseAxis.ticks.autoSkipPadding = 10.0;

        baseAxis.realtime = {
            refresh,
            duration,
            delay: 0,
            ttl: duration,
            frameRate: this.frameRate,
            onRefresh: () => {
                this.onRefresh.next();
            },
        };

        return baseAxis;
    }

}