export interface AvionicsDataEntry {
    time: number
    elapsed: number

    state: number

    voltage: number
    altitude: number
    maximumAltitude: number

    velocityX: number
    velocityY: number
    velocityZ: number

    accelerationX: number
    accelerationY: number
    accelerationZ: number

    filterAccelerationX: number
    filterAccelerationY: number
    filterAccelerationZ: number

    rotationX: number
    rotationY: number
    rotationZ: number

    parachuteVelocity: boolean
    parachuteAltitude: boolean
    parachuteOrientation: boolean
}