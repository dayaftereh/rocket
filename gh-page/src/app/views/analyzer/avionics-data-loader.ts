import { AvionicsDataEntry } from "./avionics-data-entry"

export class AvionicsDataLoader {

    private entryLength: number
    private littleEndian: boolean

    private index: number

    constructor() {
        this.index = 0
        this.littleEndian = true
        this.entryLength = (2 * 1) + (14 * 4) + (3 * 1)
    }

    private async loadArrayBuffer(file: File): Promise<ArrayBuffer> {
        const reader: FileReader = new FileReader()
        let completed: boolean = false

        return new Promise((resolve, reject) => {
            reader.onerror = (event: any) => {
                if (completed) {
                    return
                }
                completed = true
                reject(event)
            }

            reader.onloadend = () => {
                if (completed) {
                    return
                }
                completed = true

                const buf: ArrayBuffer = reader.result as ArrayBuffer
                resolve(buf)
            }

            reader.readAsArrayBuffer(file)
        })

    }

    async load(file: File): Promise<AvionicsDataEntry[]> {
        this.index = 0
        // load the file as array buffer
        const buf: ArrayBuffer = await this.loadArrayBuffer(file)
        // create the data view
        const dataView: DataView = new DataView(buf)

        const entities: AvionicsDataEntry[] = this.readEntities(dataView)
        return entities
    }

    private readEntities(dataView: DataView): AvionicsDataEntry[] {
        const list: AvionicsDataEntry[] = []

        while ((this.index + this.entryLength) <= dataView.byteLength) {
            const entry: AvionicsDataEntry = this.readEntry(dataView)
            list.push(entry)
        }

        return list
    }

    private readEntry(dataView: DataView): AvionicsDataEntry {
        const entry: AvionicsDataEntry = {} as AvionicsDataEntry

        entry.time = dataView.getUint32(this.index, this.littleEndian)
        this.index += 4

        entry.state = dataView.getUint16(this.index, this.littleEndian)
        this.index += 2

        entry.elapsed = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.voltage = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.altitude = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.maximumAltitude = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        // velocity
        entry.velocityX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.velocityY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.velocityZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        // acceleration
        entry.accelerationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        // filter acceleration
        entry.accelerationNormalizedX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationNormalizedY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationNormalizedZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        // rotation
        entry.rotationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rotationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rotationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        // parachute
        entry.parachuteVelocity = dataView.getInt8(this.index) !== 0
        this.index += 1

        // parachute
        entry.parachuteAltitude = dataView.getInt8(this.index) !== 0
        this.index += 1

        // parachute
        entry.parachuteOrientation = dataView.getInt8(this.index) !== 0
        this.index += 1

        return entry
    }

}

