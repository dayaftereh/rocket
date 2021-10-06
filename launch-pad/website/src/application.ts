import { API } from "./api/api";
import { UI } from "./ui/ui";

export class Application {

    private ui: UI | undefined
    private api: API | undefined

    constructor() {

    }

    async start(): Promise<void> {
        this.api = new API()
        //await this.api.init()

        this.ui = new UI(this.api)
        await this.ui.init()
    }

}