import { Message } from "./message";

export class MessageDecoder {

    private littleEndian: boolean = true
    
    constructor() {

    }

    decode(buf: ArrayBuffer): Message {
        const message: Message = {} as Message
        const dataView: DataView = new DataView(buf)

        let index: number = 0

        message.time = dataView.getUint16(index, this.littleEndian)
        index += 2

        message.voltage = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.altitude = dataView.getFloat32(index, this.littleEndian)
        index += 4

        // gyroscope
        message.gyroscopeX = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.gyroscopeY = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.gyroscopeZ = dataView.getFloat32(index, this.littleEndian)
        index += 4

        // acceleration
        message.accelerationX = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.accelerationY = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.accelerationZ = dataView.getFloat32(index, this.littleEndian)
        index += 4

        // rotation
        message.rotationX = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.rotationY = dataView.getFloat32(index, this.littleEndian)
        index += 4

        message.rotationZ = dataView.getFloat32(index, this.littleEndian)
        index += 4

        // parachute
        message.parachuteAltitude = dataView.getInt8(index) !== 0
        index += 1

        // parachute
        message.parachuteOrientation = dataView.getInt8(index) !== 0
        index += 1

        return message
    }

}