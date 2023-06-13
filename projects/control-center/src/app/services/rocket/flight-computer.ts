import { RocketFlightComputerState } from "lrocket"

export class FlightComputer {

    private timer: number = 0

    private state: RocketFlightComputerState

    constructor() {
        this.state = RocketFlightComputerState.Locked
    }

    update(time: number, elapsed: number): void {
        switch (this.state) {
            case RocketFlightComputerState.Locked:
                return this.locked()
            case RocketFlightComputerState.Init:
                return this.init(elapsed)
            case RocketFlightComputerState.Startup:
                return this.startup(elapsed)
            case RocketFlightComputerState.WaitForLaunch:
                return this.waitForLaunch()
            case RocketFlightComputerState.Launched:
                return this.launched()
            //....
            case RocketFlightComputerState.Terminating:
                return this.terminating(elapsed)
            case RocketFlightComputerState.Idle:
                return this.idle()
        }
    }

    private locked(): void {
        this.timer = 0
    }

    private init(elapsed: number): void {
        this.timer += elapsed
        if (this.timer < 8) {
            return
        }

        this.timer = 0
        this.changeState(RocketFlightComputerState.Startup)
    }

    private startup(elapsed: number): void {
        this.timer += elapsed
        if (this.timer < 10) {
            return
        }

        this.timer = 0
        this.changeState(RocketFlightComputerState.WaitForLaunch)
    }

    private waitForLaunch(): void {
        this.timer = 0
    }

    private launched(): void {
        this.timer = 0
    }

    private terminating(elapsed: number): void {
        this.timer += elapsed
        if (this.timer < 10000) {
            return
        }

        this.timer = 0
        this.changeState(RocketFlightComputerState.Idle)
    }

    private idle(): void {
        this.timer = 0
    }

    private changeState(state: RocketFlightComputerState): void {
        console.log(`changing flight-computer state [ ${this.state} ] to [ ${state} ]`)
        this.state = state
    }

    unlock(): void {
        this.changeState(RocketFlightComputerState.Init)
    }

    abort(): void {
        this.changeState(RocketFlightComputerState.Terminating)
    }

    start(): void {
        this.changeState(RocketFlightComputerState.Launched)
    }

    getState(): RocketFlightComputerState {
        return this.state
    }

}