import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: './app-runner-thrust-test-utilities',
    templateUrl: './runner-thrust-test-utilities.component.html'
})
export class RunnerThrustTestUtilitiesComponent {

    @Output()
    stop: EventEmitter<void>

    @Output()
    start: EventEmitter<void>

    timeout: number

    progress: number

    private startTime: number

    private timer: any | undefined

    private progressTimer: any | undefined

    constructor() {
        this.timeout = 5
        this.progress = 0
        this.startTime = Date.now()
        this.stop = new EventEmitter<void>(true)
        this.start = new EventEmitter<void>(true)
    }

    play(): void {
        this.start.next()
        this.startTime = Date.now()

        const timeout: number = Math.max(100.0, this.timeout * 1000.0)
        this.timer = setTimeout(() => {
            this.cancel()
        }, timeout)

        this.progressTimer = setInterval(() => {
            const delta: number = Date.now() - this.startTime
            this.progress = parseFloat(((delta / timeout) * 100.0).toFixed(1))
        }, 100)
    }

    cancel(): void {
        this.stop.next()

        if (this.timer !== undefined) {
            clearTimeout(this.timer)
        }

        if (this.progressTimer !== undefined) {
            clearInterval(this.progressTimer)
        }

        this.timer = undefined
        this.progressTimer = undefined

        this.progress = 0

    }


}