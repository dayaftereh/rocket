import { API } from "../api/api";
import { ConfigView } from "./config-view";
import { ControlView } from "./control-view";
import { D3View } from "./d3-view";
import { LiveView } from "./live-view";

export class UI {

    private liveView: LiveView
    private d3View: D3View
    private configView: ConfigView
    private controlView: ControlView

    constructor(private readonly api: API) {
        this.liveView = new LiveView(api)
        this.d3View = new D3View(api)
        this.configView = new ConfigView(api)
        this.controlView = new ControlView(api)
    }

    private removeLoading(): void {
        const loading: HTMLButtonElement = document.querySelector("#loading")

        setTimeout(() => {
            loading.hidden = true
        }, 1000)
    }

    async init(): Promise<void> {

        try {
            await this.d3View.init()
            await this.liveView.init()
            await this.configView.init()
            await this.controlView.init()
        } finally {
            this.removeLoading()
        }

    }

}