import { API } from "../api/api";

export class ControlView {

    constructor(private readonly api: API) {

    }

    private initTriggerParachute(): void {
        const triggerParachute: HTMLButtonElement = document.querySelector("#triggerParachute")
        triggerParachute.addEventListener('click', async () => {
            await this.api.triggerParachute()
        })
    }

    private initOpenParachut(): void {
        const openParachute: HTMLButtonElement = document.querySelector("#openParachute")
        openParachute.addEventListener('click', async () => {
            await this.api.openParachute()
        })
    }

    private initCloseParachut(): void {
        const closeParachute: HTMLButtonElement = document.querySelector("#closeParachute")
        closeParachute.addEventListener('click', async () => {
            await this.api.closeParachute()
        })
    }

    private initUnlock(): void {
        const unlock: HTMLButtonElement = document.querySelector("#unlock")
        unlock.addEventListener('click', async () => {
            await this.api.unlock()
        })
    }

    async init(): Promise<void> {
        this.initUnlock()
        this.initOpenParachut()
        this.initCloseParachut()
        this.initTriggerParachute()
    }

}