import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SerialService } from "../../../../services/serial/serial.service";
import { SerialReading } from "./serial-reading";

@Component({
    selector: 'app-serial-thrust-test-utilities',
    templateUrl: './serial-thrust-test-utilities.component.html'
})
export class SerialThrustTestUtilitiesComponent implements OnInit, OnDestroy {

    port: SerialPort | undefined

    baudRate: number;

    baudRates: SelectItem[];

    @Output()
    data: EventEmitter<SerialReading>

    private reading: boolean

    private readingDone: Promise<void> | undefined

    private subscriptions: Subscription[]

    constructor(private readonly serialService: SerialService) {
        this.baudRates = []
        this.baudRate = 9600
        this.reading = false
        this.subscriptions = []
        this.data = new EventEmitter<SerialReading>(true)
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
            this.onPort(port).catch((e: Error) => {
                this.data.error(e)
            })
        })

        this.subscriptions.push(portSubscription)
    }

    private async onPort(port: SerialPort | undefined): Promise<void> {
        this.port = port
        if (!port) {
            this.reading = false
            return
        }

        await port.open({
            baudRate: this.baudRate
        })

        if (!port.readable || !port.writable) {
            return
        }

        const reader: ReadableStreamDefaultReader<Uint8Array> = port.readable.getReader()

        this.readingDone = new Promise<void>(async (resolve) => {
            try {
                this.reading = true
                while (this.reading && !!port.readable) {
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
                this.data.error(e)
            } finally {
                this.reading = false
                reader.releaseLock()
                resolve()
            }
        })
    }

    async openValve(): Promise<void> {

    }

    async closeValve(): Promise<void> {

    }

    private onValue(data: Uint8Array): void {

    }

    async open(): Promise<void> {
        try {
            await this.serialService.open()
        } catch (e) {
            this.data.error(e)
        }
    }

    private async closing(): Promise<void> {
        this.reading = false
        if (this.readingDone) {
            await this.readingDone
        }

        await this.serialService.close()
    }

    async close(): Promise<void> {
        try {
            await this.closing()
        } catch (e) {
            this.data.error(e)
        }
    }

    async ngOnDestroy(): Promise<void> {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })

        await this.close()
    }

}