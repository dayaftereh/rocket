import { SerialReading } from './serial-reading'

export class ThrustTestTransformer {

    private buffer: Uint8Array

    constructor() {
        this.buffer = new Uint8Array()
    }

    transform(chunk: Uint8Array, controller: TransformStreamDefaultController<SerialReading>): void {
        this.buffer = new Uint8Array([...this.buffer, ...chunk])
        this.readSerialReading(controller)
    }

    private readSerialReading(controller: TransformStreamDefaultController<SerialReading>): void {
        // check buffer for 42
        while (this.buffer.byteLength > 0 && this.buffer[0] !== 42) {
            this.buffer = this.buffer.slice(1)
        }

        // unsigned long = 4 bytes
        // long = 4 bytes

        // 1 byte + 1 byte + 4 bytes + 4 bytes + 4 bytes + 4 bytes = 17 bytes
        const messageSize: number = 18

        // check if buffer has data
        if (this.buffer.byteLength < messageSize) {
            return
        }

        const view: DataView = new DataView(this.buffer.buffer, 0, messageSize)

        const valve: number = view.getInt8(1)
        const pressure: number = view.getInt32(2, true)
        const thrust: number = view.getInt32(6, true)
        const delta: number = view.getUint32(10, true)
        const time: number = view.getUint32(14, true)

        controller.enqueue({
            valve: valve > 0,
            delta, pressure, thrust, time
        })

        this.buffer = this.buffer.slice(13)
    }

    flush(controller: TransformStreamDefaultController<SerialReading>): void {
        this.readSerialReading(controller)
    }

}