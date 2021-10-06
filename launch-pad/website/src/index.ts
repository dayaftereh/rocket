import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap';

import { Application } from "./application";

document.addEventListener("DOMContentLoaded", () => {
    const app: Application = new Application()
    app.start().catch((e: Error) => {
        console.error(e)
    })
});
