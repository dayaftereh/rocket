import { API } from "../api/api";
import { Trigger } from "../api/trigger";

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

    private async initTrigger(): Promise<void> {
        const l1: HTMLInputElement = document.querySelector("#triggerL1")
        const l2: HTMLInputElement = document.querySelector("#triggerL2")


        l1.addEventListener("change", async () => {
            await this.api.setTrigger({
                l1: l1.checked
            } as Trigger)
        })

        l2.addEventListener("change", async () => {
            await this.api.setTrigger({
                l2: l2.checked
            } as Trigger)
        })

        const trigger: Trigger = await this.api.getTrigger()
        l1.checked = !!trigger.l1
        l2.checked = !!trigger.l2
    }

    async init(): Promise<void> {
        this.initUnlock()
        this.initOpenParachut()
        this.initCloseParachut()
        this.initTriggerParachute()

        await this.initTrigger();
    }

}