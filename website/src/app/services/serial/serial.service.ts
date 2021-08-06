import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { share } from "rxjs/operators";
import { serial as serialPolyfill } from 'web-serial-polyfill';

@Injectable()
export class SerialService {

    private port: BehaviorSubject<SerialPort | undefined>
    private serial: Serial | undefined

    constructor() {
        this.serial = this.find()
        this.port = new BehaviorSubject<SerialPort | undefined>(undefined)
    }

    private find(): Serial | undefined {
        if ('serial' in navigator) {
            return navigator.serial
        }
        if ('usb' in navigator) {
            return serialPolyfill as any as Serial
        }
        return undefined
    }

    private getSerial(): Serial {
        if (this.serial === undefined || !this.serial) {
            throw new Error("Serial and WebUSB not supported by browser")
        }
        return this.serial
    }

    asObservable(): Observable<SerialPort | undefined> {
        return this.port.pipe(
            share()
        )
    }

    isPort(): boolean {
        return this.getPort() !== undefined
    }

    private getPort(): SerialPort | undefined {
        return this.port.value
    }

    async open(options?: SerialPortRequestOptions): Promise<SerialPort> {
        let port: SerialPort | undefined = this.getPort()
        if (port !== undefined) {
            return port
        }

        const serial: Serial = this.getSerial()
        port = await serial.requestPort()
       /* port.addEventListener('disconnect', () => {
            this.port.next(undefined)
        })*/
        this.port.next(port)
        return port
    }

    async close(): Promise<void> {
        const port: SerialPort | undefined = this.getPort()
        if (port === undefined) {
            return
        }
        this.port.next(undefined)
        await port.close()
    }

}