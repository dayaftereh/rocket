import { AvionicsDataEntry } from "./avionics-data-entry"
import { AvionicsDataEntryType, int2Type } from "./avionics-data-entry-type"
import { AvionicsLoopEntry } from "./avionics-loop-entry"

export class AvionicsDataLoader {

    private index: number

    constructor() {
        this.index = 0
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
        // read the first byte to get the type
        const typeByte: number = dataView.getUint8(this.index)
        this.index += 1

        // get the entry type
        const type: AvionicsDataEntryType = int2Type(typeByte)
        // check if a entry type found
        if (type === AvionicsDataEntryType.Unknown) {
            throw new Error(`Unknown avionics data entry type for [ ${typeByte} ]`)
        }

        // find the decoder function for the data type
        const decodeFunction = this.findDecoderFunction(type)

        // check if little endian
        const littleEndian: boolean = this.isLittleEndian(type)
        // read the current entry length
        const entryLength: number = dataView.getUint16(this.index, littleEndian)
        this.index += 2

        const entities: AvionicsDataEntry[] = []
        // read all the entities
        while ((dataView.byteLength - this.index) >= entryLength) {
            // try to decode the next entry
            const next: AvionicsDataEntry = decodeFunction(dataView)
            // add the next entry
            entities.push(next)
        }

        return entities
    }

    private findDecoderFunction(type: AvionicsDataEntryType): (dataView: DataView) => (AvionicsDataEntry) {
        if (type === AvionicsDataEntryType.Loop) {
            return this.decodeLoop.bind(this)
        }

        throw new Error(`no decode function found for entry type [ ${type} ]`)
    }

    private isLittleEndian(type: AvionicsDataEntryType): boolean {
        if (type === AvionicsDataEntryType.Loop) {
            return true
        }
        return false
    }

    private decodeDefault(type: AvionicsDataEntryType, entry: AvionicsDataEntry, dataView: DataView): void {
        // check if little endian
        const littleEndian: boolean = this.isLittleEndian(type)

        entry.time = dataView.getUint32(this.index, littleEndian)
        this.index += 4

        entry.state = dataView.getUint16(this.index, littleEndian)
        this.index += 2

        entry.elapsed = dataView.getFloat32(this.index, littleEndian)
        this.index += 4
    }

    private decodeLoop(dataView: DataView): AvionicsLoopEntry {
        const entry: AvionicsLoopEntry = {
            type: AvionicsDataEntryType.Loop
        } as AvionicsLoopEntry

        const littleEndian: boolean = this.isLittleEndian(entry.type)

        this.decodeDefault(entry.type, entry, dataView)

        entry.rotationX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.rotationY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.rotationZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        entry.rawAccelerationX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.rawAccelerationY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.rawAccelerationZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        entry.accelerationX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.accelerationY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.accelerationZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        entry.worldAccelerationX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.worldAccelerationY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.worldAccelerationZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        entry.zeroedAccelerationX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.zeroedAccelerationY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.zeroedAccelerationZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        entry.velocityX = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.velocityY = dataView.getFloat32(this.index, littleEndian)
        this.index += 4

        entry.velocityZ = dataView.getFloat32(this.index, littleEndian)
        this.index += 4


        return entry
    }

}

