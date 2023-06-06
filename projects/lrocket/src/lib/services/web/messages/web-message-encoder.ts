import { LaunchPadStatusWebMessage } from "./launch-pad-status-web-message"
import { RocketConfigWebMessage } from "./rocket-config-web-message"
import { RocketStatusWebMessage } from "./rocket-status-web-message"
import { RocketTelemetryWebMessage } from "./rocket-telemetry-web-message"
import { LittleEndian, WebMessage } from "./web-message"
import { WebMessageType } from "./web-message-type"

export type WebMessageEncodeFunction = (message: any) => ArrayBuffer

export class WebMessageEncoder {

    private static encodeFunction: Map<WebMessageType, WebMessageEncodeFunction> = new Map<WebMessageType, WebMessageEncodeFunction>([
        [WebMessageType.Unknown, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.HelloRocket, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.HelloControlCenter, WebMessageEncoder.fixWebMessageEncoder()],
        // LaunchPad
        [WebMessageType.LaunchPadStart, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.LaunchPadAbort, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.LaunchPadStatus, WebMessageEncoder.encodeLaunchPadStatus],
        [WebMessageType.LaunchPadConfig, WebMessageEncoder.encodeLaunchPadConfig],
        [WebMessageType.ReuqestLaunchPadConfig, WebMessageEncoder.fixWebMessageEncoder()],
        // Rocket
        [WebMessageType.RocketStart, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.RocketAbort, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.RocketAbort, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.RocketOpenParachute, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.RocketCloseParachute, WebMessageEncoder.fixWebMessageEncoder()],
        [WebMessageType.RocketStatus, WebMessageEncoder.encodeRocketStatus],
        [WebMessageType.RocketTelemetry, WebMessageEncoder.encodeRocketTelemetry],
        [WebMessageType.RocketConfig, WebMessageEncoder.encodeRocketConfig],
        [WebMessageType.ReuqestRocketConfig, WebMessageEncoder.fixWebMessageEncoder()],
    ])

    private constructor() {

    }

    static encode(message: WebMessage): ArrayBuffer {

        // find the encode function for the given message type
        const encodeFunction: WebMessageEncodeFunction | undefined = WebMessageEncoder.encodeFunction.get(message.type)
        // check if a decode function found
        if (encodeFunction === undefined || encodeFunction === null) {
            throw new Error(`unable to find encode function for message type [ ${message.type} ]`)
        }
        // encode the given message
        const buf: ArrayBuffer = encodeFunction(message)

        return buf
    }

    private static fixWebMessageEncoder(): WebMessageEncodeFunction {
        return (message: WebMessage) => {
            // make a buffer with one byte
            const buf: ArrayBuffer = new ArrayBuffer(1)
            // create the data view
            const view: DataView = new DataView(buf)
            // convert message type to number
            const messageType: number = Number(message.type)
            // set the message type
            view.setUint8(0, messageType)
            return buf
        }
    }

    private static encodeLaunchPadStatus(message: LaunchPadStatusWebMessage): ArrayBuffer {
        // calculate the buffer length, starting with 1 byte for message type
        const bufLength: number = (1) + 2 + (1 + 1) + (4 + 4)
        // the moving write index
        let index: number = 0
        // create the array buffer for the message
        const buf: ArrayBuffer = new ArrayBuffer(bufLength)
        // create the data view to write into the array buffer
        const view: DataView = new DataView(buf)

        // convert the message type to a number
        const type: number = Number(message.type);
        // write the message type
        view.setUint8(index, type);
        // move the write index by 1
        index += 1;

        view.setInt16(index, message.state, LittleEndian);
        index += 2;

        view.setUint8(index, message.error ? 1 : 0);
        index += 1;

        view.setUint8(index, message.connected ? 1 : 0);
        index += 1;

        view.setFloat32(index, message.voltage, LittleEndian);
        index += 4;

        view.setFloat32(index, message.pressure, LittleEndian);
        index += 4;

        return buf
    }

    private static encodeLaunchPadConfig(message: LaunchPadStatusWebMessage): ArrayBuffer {
        // calculate the buffer length, starting with 1 byte for message type
        const bufLength: number = (1)
        // the moving write index
        let index: number = 0
        // create the array buffer for the message
        const buf: ArrayBuffer = new ArrayBuffer(bufLength)
        // create the data view to write into the array buffer
        const view: DataView = new DataView(buf)

        // convert the message type to a number
        const type: number = Number(message.type);
        // write the message type
        view.setUint8(index, type);
        // move the write index by 1
        index += 1;

        return buf
    }

    private static encodeRocketStatus(message: RocketStatusWebMessage): ArrayBuffer {
        // calculate the buffer length, starting with 1 byte for message type
        const bufLength: number = (1) + 2 + 1
        // the moving write index
        let index: number = 0
        // create the array buffer for the message
        const buf: ArrayBuffer = new ArrayBuffer(bufLength)
        // create the data view to write into the array buffer
        const view: DataView = new DataView(buf)

        // convert the message type to a number
        const type: number = Number(message.type);
        // write the message type
        view.setUint8(index, type);
        // move the write index by 1
        index += 1;

        view.setInt16(index, message.state, LittleEndian);
        index += 2;

        view.setUint8(index, message.error ? 1 : 0);
        index += 1;

        return buf
    }

    private static encodeRocketTelemetry(message: RocketTelemetryWebMessage): ArrayBuffer {
        // calculate the buffer length, starting with 1 byte for message type
        const bufLength: number = (1) + (4 + 4) + (4 + 4) + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4) + (4 + 4 + 4)
        // the moving write index
        let index: number = 0
        // create the array buffer for the message
        const buf: ArrayBuffer = new ArrayBuffer(bufLength)
        // create the data view to write into the array buffer
        const view: DataView = new DataView(buf)

        // convert the message type to a number
        const type: number = Number(message.type);
        // write the message type
        view.setUint8(index, type);
        // move the write index by 1
        index += 1;

        view.setUint32(index, message.time, LittleEndian);
        index += 4;

        view.setFloat32(index, message.elapsed, LittleEndian);
        index += 4;

        view.setFloat32(index, message.voltage, LittleEndian);
        index += 4;
        view.setFloat32(index, message.altitude, LittleEndian);
        index += 4;

        view.setFloat32(index, message.rotationX, LittleEndian);
        index += 4;
        view.setFloat32(index, message.rotationY, LittleEndian);
        index += 4;
        view.setFloat32(index, message.rotationZ, LittleEndian);
        index += 4;

        view.setFloat32(index, message.gyroscopeX, LittleEndian);
        index += 4;
        view.setFloat32(index, message.gyroscopeY, LittleEndian);
        index += 4;
        view.setFloat32(index, message.gyroscopeZ, LittleEndian);
        index += 4;

        view.setFloat32(index, message.accelerationX, LittleEndian);
        index += 4;
        view.setFloat32(index, message.accelerationY, LittleEndian);
        index += 4;
        view.setFloat32(index, message.accelerationZ, LittleEndian);
        index += 4;

        view.setFloat32(index, message.magnetometerX, LittleEndian);
        index += 4;
        view.setFloat32(index, message.magnetometerY, LittleEndian);
        index += 4;
        view.setFloat32(index, message.magnetometerZ, LittleEndian);
        index += 4;

        return buf
    }

    private static encodeRocketConfig(message: RocketConfigWebMessage): ArrayBuffer {
        // calculate the buffer length, starting with 1 byte for message type
        const bufLength: number = (1)
        // the moving write index
        let index: number = 0
        // create the array buffer for the message
        const buf: ArrayBuffer = new ArrayBuffer(bufLength)
        // create the data view to write into the array buffer
        const view: DataView = new DataView(buf)

        // convert the message type to a number
        const type: number = Number(message.type);
        // write the message type
        view.setUint8(index, type);
        // move the write index by 1
        index += 1;

        return buf
    }

}