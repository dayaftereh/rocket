export interface Message {
    time: number

    voltage: number
    altitude: number

    gyroscopeX: number
    gyroscopeY: number
    gyroscopeZ: number

    accelerationX: number
    accelerationY: number
    accelerationZ: number

    rotationX: number
    rotationY: number
    rotationZ: number

    parachuteAltitude: boolean
    parachuteOrientation: boolean
}