import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SerialService } from "../../../../services/serial/serial.service";
import { SerialReading } from "./serial-reading";
import { ThrustTestTransformer } from "./thrust-test-transformer"

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

    @Output()
    error: EventEmitter<Error>

    private reading: boolean

    private readingDone: Promise<void> | undefined

    private subscriptions: Subscription[]

    constructor(private readonly serialService: SerialService) {
        this.baudRates = []
        this.baudRate = 9600
        this.reading = false
        this.subscriptions = []
        this.error = new EventEmitter<Error>(true)
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
                this.error.next(e)
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

        const reader: ReadableStreamDefaultReader<SerialReading> = port.readable
            .pipeThrough(new TransformStream(new ThrustTestTransformer()))
            .getReader()

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
                this.error.next(e)
            } finally {
                this.reading = false
                reader.releaseLock()
                resolve()
            }
        })
    }

    private async write(data: Uint8Array): Promise<void> {
        if (!this.port || !this.port.writable) {
            return
        }

        const writer: WritableStreamDefaultWriter<Uint8Array> = this.port.writable.getWriter()
        try {
            await writer.write(data)
        } catch (e) {
            this.error.next(e)
        } finally {
            writer.releaseLock()
        }
    }

    async openValve(): Promise<void> {
        await this.write(new Uint8Array([1]))
    }

    async closeValve(): Promise<void> {
        await this.write(new Uint8Array([0]))
    }

    private onValue(data: SerialReading): void {
        this.data.next(data)
    }

    async open(): Promise<void> {
        try {
            await this.serialService.open()
        } catch (e) {
            this.error.next(e)
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
            this.error.next(e)
        }
    }

    async ngOnDestroy(): Promise<void> {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })

        await this.close()
    }

}