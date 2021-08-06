import { Component, OnDestroy, OnInit } from "@angular/core";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SerialService } from "../../../services/serial/serial.service";
import { LineBreakTransformer } from "./line-break-transformer";

@Component({
    templateUrl: './thrust-test-utilities.component.html'
})
export class ThrustTestUtilitiesComponent implements OnInit, OnDestroy {

    error: boolean

    errorText: string | undefined

    port: SerialPort | undefined

    baudRate: number;

    baudRates: SelectItem[];

    pressure: number | undefined

    force: number | undefined

    time: number | undefined

    private reading: boolean

    private readingDone: Promise<void> | undefined

    private subscriptions: Subscription[]

    constructor(private readonly serialService: SerialService) {
        this.error = false
        this.baudRates = []
        this.baudRate = 9600
        this.reading = false
        this.subscriptions = []
    }

    private showError(e: Error): void {
        this.error = true
        let stack: string = ''
        if (e.stack) {
            stack = e.stack
        }
        this.errorText = `[${e.name}] - ${e.message} - ${stack}`
    }

    ngOnInit(): void {
        this.baudRates.push(
            {
                value: 9600,
                label: '9600'
            },
            {
                value: 14400,
                label: '14400'
            },
            {
                value: 19200,
                label: '19200'
            },
            {
                value: 28800,
                label: '28800'
            },
            {
                value: 31250,
                label: '31250'
            },
        )

        const portSubscription: Subscription = this.serialService.asObservable().subscribe((port: SerialPort | undefined) => {
            this.port = port
            if (!port) {
                this.reading = false
                return
            }

            this.onPort(port).catch((e: Error) => {
                console.error(e)
                this.showError(e)
            })
        })
        this.subscriptions.push(portSubscription)
    }

    private async onPort(port: SerialPort): Promise<void> {
        await port.open({
            baudRate: this.baudRate
        })

        if (!port.readable || !port.writable) {
            return
        }

        const reader: ReadableStreamReader<string> = port.readable
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader()

        this.readingDone = new Promise<void>(async (resolve) => {
            try {
                this.reading = true
                while (this.reading) {
                    const { value, done } = await reader.read()
                    if (done) {
                        break
                    }

                    if (!!value) {
                        this.onValue(value)
                    }
                }
                //reader.cancel()
            } catch (e) {
                this.showError(e)
            } finally {
                this.reading = false
                reader.releaseLock()
                resolve()
                console.log("done")
            }
        })
    }

    private onValue(value: string): void {
        const values: number[] = value.split(/\s+/g)
            .map((v: string) => {
                return v.trim()
            })
            .map((v: string) => {
                return parseInt(v)
            })

        if (!values || values.length < 4) {
            return
        }
        this.pressure = values[0]
        this.force = values[1]
        this.time = values[3]

        console.log(values)
    }

    async open(): Promise<void> {
        try {
            await this.serialService.open()
        } catch (e) {
            this.showError(e)
        }
    }

    async close(): Promise<void> {
        try {
            this.reading = false
            if (this.readingDone) {
                console.log(this.readingDone)
                await this.readingDone
            }
            await this.serialService.close()
        } catch (e) {
            this.showError(e)
        }
    }

    async ngOnDestroy(): Promise<void> {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })

        await this.close()
    }

}