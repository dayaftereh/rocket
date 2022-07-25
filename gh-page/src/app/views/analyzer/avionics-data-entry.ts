import { AvionicsDataEntryType } from "./avionics-data-entry-type"

export interface AvionicsDataEntry {
    type: AvionicsDataEntryType

    time: number
    state: number
    elapsed: number   
}