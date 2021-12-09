import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss'
import "./style.scss"
import { Application } from "./application";

document.addEventListener("DOMContentLoaded", () => {
    const app: Application = new Application()
    app.start().catch((e: Error) => {
        console.error(e)
    })
});
