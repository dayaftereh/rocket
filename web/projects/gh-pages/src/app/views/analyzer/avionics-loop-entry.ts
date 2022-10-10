import { AvionicsDataEntry } from "./avionics-data-entry";

export interface AvionicsLoopEntry extends AvionicsDataEntry {
    rotationX: number
    rotationY: number
    rotationZ: number

    rawAccelerationX: number
    rawAccelerationY: number
    rawAccelerationZ: number

    accelerationX: number
    accelerationY: number
    accelerationZ: number

    worldAccelerationX: number
    worldAccelerationY: number
    worldAccelerationZ: number

    zeroedAccelerationX: number
    zeroedAccelerationY: number
    zeroedAccelerationZ: number

    velocityX: number
    velocityY: number
    velocityZ: number
}