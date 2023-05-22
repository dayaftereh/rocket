import { WebMessage } from "./web-message";

export interface RocketStatusWebMessage extends WebMessage { 
    state: number
    error: boolean
}