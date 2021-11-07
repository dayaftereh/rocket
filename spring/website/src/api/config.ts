export interface Config {
    parachuteServo: boolean
    parachuteTimeout: number
    parachuteServoOpenAngle: number
    parachuteServoCloseAngle: number

    rotationX: number
    rotationY: number
    rotationZ: number

    launchAngle: number
    launchAcceleration: number

    apogeeGravityThreshold: number
    apogeeAltitudeThreshold: number
    apogeeOrientationThreshold: number

    landingAcceleration: number
    landingAltitudeThreshold: number
    landingOrientationTimeout: number
    landingOrientationThreshold: number

    madgwickKI: number
    madgwickKP: number
}