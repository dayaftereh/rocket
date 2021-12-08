import { API } from "../api/api"
import { Config } from "../api/config"

export class ConfigForm {

    constructor(private readonly api: API) {

    }

    async init(): Promise<void> {
        const configParachuteServo: HTMLInputElement = document.querySelector("#configParachuteServo")
        const configParachuteTimeout: HTMLInputElement = document.querySelector("#configParachuteTimeout")
        const configParachuteServoOpenAngle: HTMLInputElement = document.querySelector("#configParachuteServoOpenAngle")
        const configParachuteServoCloseAngle: HTMLInputElement = document.querySelector("#configParachuteServoCloseAngle")

        const configLaunchAngle: HTMLInputElement = document.querySelector("#configLaunchAngle")
        const configLaunchAcceleration: HTMLInputElement = document.querySelector("#configLaunchAcceleration")

        const configLiftOffVelocityThreshold: HTMLInputElement = document.querySelector("#configLiftOffVelocityThreshold")

        const configApogeeVelocityThreshold: HTMLInputElement = document.querySelector("#configApogeeVelocityThreshold")
        const configApogeeAltitudeThreshold: HTMLInputElement = document.querySelector("#configApogeeAltitudeThreshold")
        const configApogeeOrientationThreshold: HTMLInputElement = document.querySelector("#configApogeeOrientationThreshold")

        const configLandingAcceleration: HTMLInputElement = document.querySelector("#configLandingAcceleration")
        const configLandingAltitudeThreshold: HTMLInputElement = document.querySelector("#configLandingAltitudeThreshold")
        const configLandingOrientationTimeout: HTMLInputElement = document.querySelector("#configLandingOrientationTimeout")
        const configLandingOrientationThreshold: HTMLInputElement = document.querySelector("#configLandingOrientationThreshold")

        const configMadgwickKI: HTMLInputElement = document.querySelector("#configMadgwickKI")
        const configMadgwickKP: HTMLInputElement = document.querySelector("#configMadgwickKP")

        const configRotationX: HTMLInputElement = document.querySelector("#configRotationX")
        const configRotationY: HTMLInputElement = document.querySelector("#configRotationY")
        const configRotationZ: HTMLInputElement = document.querySelector("#configRotationZ")

        const configForm: HTMLFormElement = document.querySelector("#configForm")

        configForm.addEventListener('submit', async (ev: Event) => {
            ev.preventDefault()

            const config: Config = {
                madgwickKI: +(configMadgwickKI.value),
                madgwickKP: +(configMadgwickKP.value),

                rotationX: +(configRotationX.value),
                rotationY: +(configRotationY.value),
                rotationZ: +(configRotationZ.value),

                parachuteServo: configParachuteServo.checked,
                parachuteTimeout: parseInt(configParachuteTimeout.value),
                parachuteServoOpenAngle: parseInt(configParachuteServoOpenAngle.value),
                parachuteServoCloseAngle: parseInt(configParachuteServoCloseAngle.value),

                launchAngle: +(configLaunchAngle.value),
                launchAcceleration: +(configLaunchAcceleration.value),

                liftOffVelocityThreshold: +(configLiftOffVelocityThreshold.value),

                apogeeVelocityThreshold: +(configApogeeVelocityThreshold.value),
                apogeeAltitudeThreshold: +(configApogeeAltitudeThreshold.value),
                apogeeOrientationThreshold: +(configApogeeOrientationThreshold.value),

                landingAcceleration: +(configLandingAcceleration.value),
                landingAltitudeThreshold: +(configLandingAltitudeThreshold.value),
                landingOrientationTimeout: +(configLandingOrientationTimeout.value),
                landingOrientationThreshold: +(configLandingOrientationThreshold.value),

            }

            await this.api.setConfig(config)
        })

        const config: Config = await this.api.getConfig()

        configParachuteServo.checked = config.parachuteServo
        configParachuteTimeout.value = `${config.parachuteTimeout}`
        configParachuteServoOpenAngle.value = `${config.parachuteServoOpenAngle}`
        configParachuteServoCloseAngle.value = `${config.parachuteServoCloseAngle}`

        configMadgwickKI.value = `${config.madgwickKI}`
        configMadgwickKP.value = `${config.madgwickKP}`

        configRotationX.value = `${config.rotationX}`
        configRotationY.value = `${config.rotationY}`
        configRotationZ.value = `${config.rotationZ}`

        configLaunchAngle.value = `${config.launchAngle}`
        configLaunchAcceleration.value = `${config.launchAcceleration}`

        configLiftOffVelocityThreshold.value = `${config.liftOffVelocityThreshold}`

        configApogeeVelocityThreshold.value = `${config.apogeeVelocityThreshold}`
        configApogeeAltitudeThreshold.value = `${config.apogeeAltitudeThreshold}`
        configApogeeOrientationThreshold.value = `${config.apogeeOrientationThreshold}`

        configLandingAcceleration.value = `${config.landingAcceleration}`
        configLandingAltitudeThreshold.value = `${config.landingAltitudeThreshold}`
        configLandingOrientationTimeout.value = `${config.landingOrientationTimeout}`
        configLandingOrientationThreshold.value = `${config.landingOrientationThreshold}`
    }

}