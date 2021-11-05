export interface Config {
    parachuteTimeout: number

    rotationX: number
    rotationY: number
    rotationZ: number

    launchAngle: number
    launchAcceleration: number

    apogeeAltitudeThreshold: number
    apogeeOrientationThreshold: number

    landingAcceleration: number
    landingAltitudeThreshold: number
    landingOrientationTimeout: number
    landingOrientationThreshold: number

    madgwickKI: number
    madgwickKP: number
}