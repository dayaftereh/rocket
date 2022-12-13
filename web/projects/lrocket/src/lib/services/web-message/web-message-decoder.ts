import { LaunchPadStatusWebMessage } from "./launch-pad-status-web-message";
import { RocketConfigWebMessage } from "./rocket-config-web-message";
import { RocketStatusWebMessage } from "./rocket-status-web-message";
import { RocketTelemetryWebMessage } from "./rocket-telemetry-web-message";
import { WebMessage } from "./web-message";
import { WebMessageType } from "./web-message-type";

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
        [WebMessageType.UnlockAbort, WebMessageDecoder.fixWebMessageDecoder(WebMessageType.UnlockAbort)],
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
        const rawMessageType: number = view.getInt8(index)
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

    }

    private static decodeLaunchPadConfig(data: ArrayBuffer): LaunchPadStatusWebMessage {

    }

    private static decodeRocketStatus(data: ArrayBuffer): RocketStatusWebMessage {

    }

    private static decodeRocketTelemetry(data: ArrayBuffer): RocketTelemetryWebMessage {

    }

    private static decodeRocketConfig(data: ArrayBuffer): RocketConfigWebMessage {

    }
    
}