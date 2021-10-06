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

        const configForm: HTMLFormElement = document.querySelector("#configForm")

        configForm.addEventListener('submit', async (ev: Event) => {
            ev.preventDefault()

            const config: Config = {
                pressureFactor: +(pressureFactor.value),
                pressureOffset: +(pressureOffset.value),
                voltageFactor: +(voltageFactor.value),
                voltageOffset: +(voltageOffset.value)
            }

            await this.api.setConfig(config)
        })

        const config: Config = await this.api.getConfig()

        pressureFactor.value = `${config.pressureFactor}`
        pressureOffset.value = `${config.pressureOffset}`

        voltageFactor.value = `${config.voltageFactor}`
        voltageOffset.value = `${config.voltageOffset}`
    }

    private initCurrentValues(): void {
        const valve: HTMLInputElement = document.querySelector("#valve")
        const currentVoltage: HTMLInputElement = document.querySelector("#currentVoltage")
        const currentPressure: HTMLInputElement = document.querySelector("#currentPressure")

        this.api.asObservable().subscribe((message: Message) => {
            valve.checked = message.valve
            currentVoltage.value = this.formatNumber(message.voltage)
            currentPressure.value = this.formatNumber(message.pressure)
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