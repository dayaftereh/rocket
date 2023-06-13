import { LaunchPadStatusWebMessage } from "./launch-pad-status-web-message"
import { RocketConfigWebMessage } from "./rocket-config-web-message"
import { RocketStatusWebMessage } from "./rocket-status-web-message"
import { RocketTelemetryWebMessage } from "./rocket-telemetry-web-message"
import { LittleEndian, WebMessage } from "./web-message"
import { WebMessageType } from "./web-message-type"

export type WebMessageDecodeFunction = (buf: ArrayBuffer) => WebMessage

export class WebMessageDecoder {

    private static decodeFunction: Map<WebMessageType, WebMessageDecodeFunction> = new Map<WebMessageType, WebMessageDecodeFunction>([
        [WebMessageType.Unknown, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.Unknown)],
        [WebMessageType.HelloRocket, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.HelloRocket)],
        [WebMessageType.HelloControlCenter, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.HelloControlCenter)],
        // LaunchPad
        [WebMessageType.LaunchPadStart, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.LaunchPadStart)],
        [WebMessageType.LaunchPadAbort, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.LaunchPadAbort)],
        [WebMessageType.LaunchPadStatus, WebMessageDecoder.decodeLaunchPadStatus],
        [WebMessageType.LaunchPadConfig, WebMessageDecoder.decodeLaunchPadConfig],
        [WebMessageType.ReuqestLaunchPadConfig, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.ReuqestLaunchPadConfig)],
        // Rocket
        [WebMessageType.RocketStart, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.RocketStart)],
        [WebMessageType.RocketAbort, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.RocketAbort)],
        [WebMessageType.RocketUnlock, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.RocketUnlock)],
        [WebMessageType.RocketOpenParachute, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.RocketOpenParachute)],
        [WebMessageType.RocketCloseParachute, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.RocketCloseParachute)],
        [WebMessageType.RocketStatus, WebMessageDecoder.decodeRocketStatus],
        [WebMessageType.RocketTelemetry, WebMessageDecoder.decodeRocketTelemetry],
        [WebMessageType.RocketConfig, WebMessageDecoder.decodeRocketConfig],
        [WebMessageType.ReuqestRocketConfig, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.ReuqestRocketConfig)],
    ])

    private constructor() {

    }

    private static readMessageType(view: DataView, index?: number): WebMessageType {
        // check if a index given
        if (index === undefined || index === null) {
            // if not given, set the index to zero
            index = 0
        }
        // read the message type
        const rawMessageType: number = view.getUint8(index)
        // get the correct message type
        const messageType: WebMessageType = rawMessageType as WebMessageType
        return messageType
    }

    static decode(data: ArrayBuffer): WebMessage {
        // the data view of the given ArrayBuffer
        const view: DataView = new DataView(data)
        // read the message type
        const messageType: WebMessageType = WebMessageDecoder.readMessageType(view)

        // find the decode function for the received message type
        const decodeFunction: WebMessageDecodeFunction | undefined = WebMessageDecoder.decodeFunction.get(messageType)
        // check if a decode function found
        if (decodeFunction === undefined || decodeFunction === null) {
            throw new Error(`unable to find decode function for message type [ ${messageType} ]`)
        }

        // decode the message based on the found decode function
        const message: WebMessage = decodeFunction(data)

        return message
    }


    private static fixWebMessageDecoder(type: WebMessageType): WebMessageDecodeFunction {
        return () => {
            return {
                type
            }
        }
    }

    private static decodeLaunchPadStatus(data: ArrayBuffer): LaunchPadStatusWebMessage {
        let index: number = 1 // skip the message type
        const view: DataView = new DataView(data)

        const state: number = view.getInt16(index, LittleEndian)
        index += 2

        const error: boolean = view.getInt8(index) != 0
        index += 1

        const connected: boolean = view.getInt8(index) != 0
        index += 1

        const voltage: number = view.getFloat32(index, LittleEndian)
        index += 4

        const pressure: number = view.getFloat32(index, LittleEndian)
        index += 4

        return {
            type: WebMessageType.LaunchPadStatus,
            state,
            error,
            connected,
            voltage,
            pressure,
        }
    }

    private static decodeLaunchPadConfig(data: ArrayBuffer): LaunchPadStatusWebMessage {
        let index: number = 1 // skip the message type
        const view: DataView = new DataView(data)

        return {} as LaunchPadStatusWebMessage
    }

    private static decodeRocketStatus(data: ArrayBuffer): RocketStatusWebMessage {
        let index: number = 1 // skip the message type
        const view: DataView = new DataView(data)

        const state: number = view.getInt16(index, LittleEndian)
        index += 2

        const error: boolean = view.getInt8(index) != 0
        index += 1

        return {
            type: WebMessageType.RocketStatus,
            state,
            error,
        }
    }

    private static decodeRocketTelemetry(data: ArrayBuffer): RocketTelemetryWebMessage {
        let index: number = 1 // skip the message type
        const view: DataView = new DataView(data)

        const time: number = view.getUint32(index, LittleEndian)
        index += 4

        const elapsed: number = view.getFloat32(index, LittleEndian)
        index += 4

        const voltage: number = view.getFloat32(index, LittleEndian)
        index += 4

        const altitude: number = view.getFloat32(index, LittleEndian)
        index += 4

        const rotationX: number = view.getFloat32(index, LittleEndian)
        index += 4
        const rotationY: number = view.getFloat32(index, LittleEndian)
        index += 4
        const rotationZ: number = view.getFloat32(index, LittleEndian)
        index += 4

        const gyroscopeX: number = view.getFloat32(index, LittleEndian)
        index += 4
        const gyroscopeY: number = view.getFloat32(index, LittleEndian)
        index += 4
        const gyroscopeZ: number = view.getFloat32(index, LittleEndian)
        index += 4

        const accelerationX: number = view.getFloat32(index, LittleEndian)
        index += 4
        const accelerationY: number = view.getFloat32(index, LittleEndian)
        index += 4
        const accelerationZ: number = view.getFloat32(index, LittleEndian)
        index += 4

        const magnetometerX: number = view.getFloat32(index, LittleEndian)
        index += 4
        const magnetometerY: number = view.getFloat32(index, LittleEndian)
        index += 4
        const magnetometerZ: number = view.getFloat32(index, LittleEndian)
        index += 4

        return {
            type: WebMessageType.RocketTelemetry,
            time,
            elapsed,
            voltage,
            altitude,
            rotationX,
            rotationY,
            rotationZ,
            gyroscopeX,
            gyroscopeY,
            gyroscopeZ,
            accelerationX,
            accelerationY,
            accelerationZ,
            magnetometerX,
            magnetometerY,
            magnetometerZ,
        }
    }

    private static decodeRocketConfig(data: ArrayBuffer): RocketConfigWebMessage {
        let index: number = 1 // skip the message type
        const view: DataView = new DataView(data)

        return {} as RocketConfigWebMessage
    }

}