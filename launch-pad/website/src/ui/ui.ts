import { API } from "../api/api";
import { Tab } from 'bootstrap'
import { Config } from "../api/config";
import { Message } from "../api/message";
export class UI {

    constructor(private readonly api: API) {

    }

    private async initConfigForm(): Promise<void> {

        const pressureFactor: HTMLInputElement = document.querySelector("#configPressureFactor")
        const pressureOffset: HTMLInputElement = document.querySelector("#configPressureOffset")

        const voltageFactor: HTMLInputElement = document.querySelector("#configVoltageFactor")
        const voltageOffset: HTMLInputElement = document.querySelector("#configVoltageOffset")

        const openTimeout: HTMLInputElement = document.querySelector("#configOpenTimeout")

        const configForm: HTMLFormElement = document.querySelector("#configForm")

        configForm.addEventListener('submit', async (ev: Event) => {
            ev.preventDefault()

            const config: Config = {
                pressureFactor: +(pressureFactor.value),
                pressureOffset: +(pressureOffset.value),
                voltageFactor: +(voltageFactor.value),
                voltageOffset: +(voltageOffset.value),
                openTimeout: +(openTimeout.value)
            }

            await this.api.setConfig(config)
        })

        const config: Config = await this.api.getConfig()

        pressureFactor.value = `${config.pressureFactor}`
        pressureOffset.value = `${config.pressureOffset}`

        voltageFactor.value = `${config.voltageFactor}`
        voltageOffset.value = `${config.voltageOffset}`

        openTimeout.value = `${config.openTimeout}`
    }

    private liproS1VoltageLevelColor(voltage: number): string {
        const full: number = 4.2
        const empty: number = 3.27

        const percentage: number = (voltage - empty) / (full - empty)
        const hue: number = Math.min(1.0, Math.max(0.0, percentage)) * 120.0
        return `hsl(${hue}, 100%, 50%)`
    }

    private initCurrentValues(): void {
        const valve: HTMLInputElement = document.querySelector("#valve")
        const currentVoltage: HTMLInputElement = document.querySelector("#currentVoltage")
        const currentPressure: HTMLInputElement = document.querySelector("#currentPressure")



        this.api.asObservable().subscribe((message: Message) => {
            valve.checked = message.valve
            currentVoltage.value = this.formatNumber(message.voltage)
            currentPressure.value = this.formatNumber(message.pressure)

            currentVoltage.style.background = this.liproS1VoltageLevelColor(message.voltage)
        })
    }

    private initLaunch(): void {
        const launch: HTMLButtonElement = document.querySelector("#launch")
        launch.addEventListener('click', async () => {
            await this.api.valve({
                open: true
            })
        })
    }

    private formatNumber(x: number): string {
        return x.toFixed(2)
    }

    async init(): Promise<void> {
        this.initLaunch()
        await this.initConfigForm()
        await this.initCurrentValues()


    }

}