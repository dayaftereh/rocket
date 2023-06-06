import { WebMessageType } from "./web-message-type"

export const LittleEndian: boolean = false

export interface WebMessage {
    type: WebMessageType
}