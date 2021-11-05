import { API } from "../api/api";
import { Config } from "../api/config";
import { Message } from "../api/message";
import { Viewer3D } from "./viewer-3d";

export class UI {

    private viewer3d: Viewer3D

    constructor(private readonly api: API) {
        this.viewer3d = new Viewer3D(api)
    }

    private async initConfigForm(): Promise<void> {
        const configParachuteTimeout: HTMLInputElement = document.querySelector("#configParachuteTimeout")

        const configLaunchAngle: HTMLInputElement = document.querySelector("#configLaunchAngle")
        const configLaunchAcceleration: HTMLInputElement = document.querySelector("#configLaunchAcceleration")

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

                parachuteTimeout: +(configParachuteTimeout.value),

                launchAngle: +(configLaunchAngle.value),
                launchAcceleration: +(configLaunchAcceleration.value),

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

        configParachuteTimeout.value = `${config.parachuteTimeout}`

        configMadgwickKI.value = `${config.madgwickKI}`
        configMadgwickKP.value = `${config.madgwickKP}`

        configRotationX.value = `${config.rotationX}`
        configRotationY.value = `${config.rotationY}`
        configRotationZ.value = `${config.rotationZ}`

        configLaunchAngle.value = `${config.launchAngle}`
        configLaunchAcceleration.value = `${config.launchAcceleration}`

        configApogeeAltitudeThreshold.value = `${config.apogeeAltitudeThreshold}`
        configApogeeOrientationThreshold.value = `${config.apogeeOrientationThreshold}`

        configLandingAcceleration.value = `${config.landingAcceleration}`
        configLandingAltitudeThreshold.value = `${config.landingAltitudeThreshold}`
        configLandingOrientationTimeout.value = `${config.landingOrientationTimeout}`
        configLandingOrientationThreshold.value = `${config.landingOrientationThreshold}`
    }

    private liproS1VoltageLevelColor(voltage: number): string {
        const full: number = 4.2
        const empty: number = 3.27

        const percentage: number = (voltage - empty) / (full - empty)
        const hue: number = Math.min(1.0, Math.max(0.0, percentage)) * 120.0
        return `hsl(${hue}, 100%, 50%)`
    }

    private initWebSocketMessage(): void {
        const currentTime: HTMLInputElement = document.querySelector("#currentTime")
        const currentElapsed: HTMLInputElement = document.querySelector("#currentElapsed")
        const currentVoltage: HTMLInputElement = document.querySelector("#currentVoltage")
        const currentAltitude: HTMLInputElement = document.querySelector("#currentAltitude")

        const currentGyroscopeX: HTMLInputElement = document.querySelector("#currentGyroscopeX")
        const currentGyroscopeY: HTMLInputElement = document.querySelector("#currentGyroscopeY")
        const currentGyroscopeZ: HTMLInputElement = document.querySelector("#currentGyroscopeZ")

        const currentAccelerationX: HTMLInputElement = document.querySelector("#currentAccelerationX")
        const currentAccelerationY: HTMLInputElement = document.querySelector("#currentAccelerationY")
        const currentAccelerationZ: HTMLInputElement = document.querySelector("#currentAccelerationZ")

        const currentMagnetometerX: HTMLInputElement = document.querySelector("#currentMagnetometerX")
        const currentMagnetometerY: HTMLInputElement = document.querySelector("#currentMagnetometerY")
        const currentMagnetometerZ: HTMLInputElement = document.querySelector("#currentMagnetometerZ")

        const currentRotationX: HTMLInputElement = document.querySelector("#currentRotationX")
        const currentRotationY: HTMLInputElement = document.querySelector("#currentRotationY")
        const currentRotationZ: HTMLInputElement = document.querySelector("#currentRotationZ")

        const parachuteAltitude: HTMLInputElement = document.querySelector("#parachuteAltitude")
        const parachuteOrientation: HTMLInputElement = document.querySelector("#parachuteOrientation")

        this.api.asObservable().subscribe((message: Message) => {
            currentTime.value = this.formatNumber(message.time)
            currentElapsed.value = message.elapsed.toFixed(5)
            currentVoltage.value = this.formatNumber(message.voltage)
            currentAltitude.value = this.formatNumber(message.altitude)

            currentGyroscopeX.value = this.formatNumber(message.gyroscopeX)
            currentGyroscopeY.value = this.formatNumber(message.gyroscopeY)
            currentGyroscopeZ.value = this.formatNumber(message.gyroscopeZ)

            currentAccelerationX.value = this.formatNumber(message.accelerationX)
            currentAccelerationY.value = this.formatNumber(message.accelerationY)
            currentAccelerationZ.value = this.formatNumber(message.accelerationZ)

            currentMagnetometerX.value = this.formatNumber(message.magnetometerX)
            currentMagnetometerY.value = this.formatNumber(message.magnetometerY)
            currentMagnetometerZ.value = this.formatNumber(message.magnetometerZ)

            currentRotationX.value = this.formatNumber(message.rotationX)
            currentRotationY.value = this.formatNumber(message.rotationY)
            currentRotationZ.value = this.formatNumber(message.rotationZ)

            parachuteAltitude.checked = message.parachuteAltitude
            parachuteOrientation.checked = message.parachuteOrientation

            currentVoltage.style.background = this.liproS1VoltageLevelColor(message.voltage)
        })
    }

    private formatNumber(x: number): string {
        return x.toFixed(2)
    }

    private initParachuteTrigger(): void {
        const parachuteTrigger: HTMLButtonElement = document.querySelector("#parachuteTrigger")
        parachuteTrigger.addEventListener('click', async () => {
            await this.api.trigger()
        })
    }

    async init(): Promise<void> {
        this.initParachuteTrigger()

        await this.initConfigForm()
        await this.initWebSocketMessage()

        await this.viewer3d.init()
    }

}