import { AvionicsDataEntry } from "./avionics-data-entry"
import { AvionicsDataEntryType, int2Type } from "./avionics-data-entry-type"
import { AvionicsLoopEntry } from "./avionics-loop-entry"

export class AvionicsDataLoader {

    private index: number
    private littleEndian: boolean

    constructor() {
        this.index = 0
        this.littleEndian = false
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
        // find the decoder function for the data type
        const decodeFunction = this.findDecoderFunction(dataView)

        const entities: AvionicsDataEntry[] = []

        while (true) {
            // try to decode the next entry
            const next: AvionicsDataEntry | undefined = decodeFunction(dataView)
            if (!next) {
                return entities
            }
            // add the next entry
            entities.push(next)
        }
    }



    private findDecoderFunction(dataView: DataView): (dataView: DataView) => (AvionicsDataEntry | undefined) {
        const t: number = dataView.getUint8(this.index)
        const type: AvionicsDataEntryType = int2Type(t)
        this.index += 1

        if (type === AvionicsDataEntryType.Loop) {
            return this.decodeLoop.bind(this)
        }

        throw new Error(`Unknown avionics data entry type for  [ ${t} ]`)
    }

    private decodeDefault(entry: AvionicsDataEntry, dataView: DataView): void {
        entry.time = dataView.getUint32(this.index, this.littleEndian)
        this.index += 4

        entry.state = dataView.getUint16(this.index, this.littleEndian)
        this.index += 2

        entry.elapsed = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4
    }

    private decodeLoop(dataView: DataView): AvionicsLoopEntry | undefined {
        const requiredLength: number = (4 + 4) + 2 + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4)
        // check if a entry is left
        if ((dataView.byteLength - this.index) < requiredLength) {
            return undefined
        }

        const entry: AvionicsLoopEntry = {
            type: AvionicsDataEntryType.Loop
        } as AvionicsLoopEntry

        this.decodeDefault(entry, dataView)

        entry.rotationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rotationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rotationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        entry.rawAccelerationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rawAccelerationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.rawAccelerationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        entry.accelerationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.accelerationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        entry.worldAccelerationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.worldAccelerationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.worldAccelerationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        entry.zeroedAccelerationX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.zeroedAccelerationY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.zeroedAccelerationZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        entry.velocityX = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.velocityY = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4

        entry.velocityZ = dataView.getFloat32(this.index, this.littleEndian)
        this.index += 4


        return entry
    }

}

