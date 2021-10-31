export interface Message {
    time: number
    elapsed: number

    voltage: number
    altitude: number

    gyroscopeX: number
    gyroscopeY: number
    gyroscopeZ: number

    accelerationX: number
    accelerationY: number
    accelerationZ: number

    magnetometerX: number
    magnetometerY: number
    magnetometerZ: number

    rotationX: number
    rotationY: number
    rotationZ: number

    parachuteAltitude: boolean
    parachuteOrientation: boolean
}