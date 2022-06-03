import { API } from "../api/api";
import { Config } from "../api/config";
import { Message } from "../api/message";
import { ConfigForm } from "./config-form";
import { Viewer3D } from "./viewer-3d";

export class UI {

    private viewer3d: Viewer3D
    private configForm: ConfigForm

    constructor(private readonly api: API) {
        this.viewer3d = new Viewer3D(api)
        this.configForm = new ConfigForm(api)
    }

    private liproS1VoltageLevelColor(voltage: number): string {
        const full: number = 4.2
        const empty: number = 3.27

        const percentage: number = (voltage - empty) / (full - empty)
        const hue: number = Math.min(1.0, Math.max(0.0, percentage)) * 120.0
        return `hsl(${hue}, 100%, 50%)`
    }

    private initWebSocketMessage(): void {
        const unlock: HTMLButtonElement = document.querySelector("#unlock")

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

        const parachuteVelocity: HTMLInputElement = document.querySelector("#parachuteVelocity")
        const parachuteAltitude: HTMLInputElement = document.querySelector("#parachuteAltitude")
        const parachuteOrientation: HTMLInputElement = document.querySelector("#parachuteOrientation")

        const flightObserverState: HTMLInputElement = document.querySelector("#currentFlightObserverState")

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

            parachuteVelocity.checked = message.parachuteVelocity
            parachuteAltitude.checked = message.parachuteAltitude
            parachuteOrientation.checked = message.parachuteOrientation

            flightObserverState.value = `${message.flightObserverState}`

            unlock.disabled = !message.locked;

            currentVoltage.style.background = this.liproS1VoltageLevelColor(message.voltage)
        })
    }

    private formatNumber(x: number): string {
        return x.toFixed(2)
    }

    private initParachute(): void {
        const parachuteTrigger: HTMLButtonElement = document.querySelector("#parachuteTrigger")
        parachuteTrigger.addEventListener('click', async () => {
            await this.api.triggerParachute()
        })

        const parachuteOpen: HTMLButtonElement = document.querySelector("#parachuteOpen")
        parachuteOpen.addEventListener('click', async () => {
            await this.api.openParachute()
        })

        const parachuteClose: HTMLButtonElement = document.querySelector("#parachuteClose")
        parachuteClose.addEventListener('click', async () => {
            await this.api.closeParachute()
        })
    }

    private initUnlock(): void {
        const unlock: HTMLButtonElement = document.querySelector("#unlock")
        unlock.addEventListener('click', async () => {
            await this.api.unlock()
        })
    }

    private removeLoading(): void {
        const loading: HTMLButtonElement = document.querySelector("#loading")

        setTimeout(() => {
            loading.hidden = true
        }, 1000)
    }

    async init(): Promise<void> {
        this.initParachute()
        this.initUnlock();

        await this.configForm.init()
        await this.initWebSocketMessage()
        

        await this.viewer3d.init()

        this.removeLoading()
    }

}