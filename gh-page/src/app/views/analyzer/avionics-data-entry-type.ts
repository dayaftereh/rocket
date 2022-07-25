export enum AvionicsDataEntryType {
    Loop = "Loop",
    Unknown = "Unknown",
}

export function int2Type(i: number): AvionicsDataEntryType {
    switch (i) {
        case 1:
            return AvionicsDataEntryType.Loop
    }
    return AvionicsDataEntryType.Unknown
}