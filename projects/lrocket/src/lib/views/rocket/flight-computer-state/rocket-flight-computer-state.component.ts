import { Component, Input, OnDestroy, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { FormUtils } from "../../../public-api";
import { RocketFlightComputerState } from "../../../services/web/messages/rocket-flight-computer-state";

@Component({
    selector: 'lrocket-flight-computer-state',
    templateUrl: './rocket-flight-computer-state.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RocketFlightComputerStateComponent),
        multi: true
    }]
})
export class RocketFlightComputerStateComponent implements ControlValueAccessor, OnInit, OnDestroy {

    formGroup: FormGroup

    states: SelectItem[]

    @Input()
    inputId: string

    @Input()
    styleClass: string

    private onChange: any | undefined
    private onTouched: any | undefined

    private subscriptions: Subscription[]

    constructor() {
        this.states = []
        this.inputId = ''
        this.styleClass = ''
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            state: new FormControl(),
        })
    }

    ngOnInit(): void {
        this.states = this.listStates()

        const fromSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })
        this.subscriptions.push(fromSubscription)
    }

    private lowercaseFirstLetter(s: string): string {
        if (!s) {
            return s
        }
        return s.charAt(0).toLowerCase() + s.slice(1);
    }

    private listStates(): SelectItem[] {
        return Object.values(RocketFlightComputerState)
            .filter((value: string | RocketFlightComputerState) => {
                return typeof value !== 'number'
            })
            .map((value: string | RocketFlightComputerState) => {
                const name: string = value as string
                return this.lowercaseFirstLetter(name)
            })
            .map((name: string) => {
                return {
                    value: name,
                }
            })
    }

    private onFormChanged(): void {
        const state: RocketFlightComputerState = this.getState()

        if (this.onTouched) {
            this.onTouched()
        }

        if (this.onChange) {
            this.onChange(state)
        }
    }

    writeValue(state: RocketFlightComputerState | undefined): void {
        if (state === undefined || state === null) {
            return
        }

        this.formGroup.patchValue({
            state
        }, { emitEvent: true })
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean): void {
        const opts: any = { emitEvent: false }
        if (isDisabled) {
            this.formGroup.disable(opts)
        } else {
            this.formGroup.enable(opts)
        }
    }

    private getState(): RocketFlightComputerState {
        const state: RocketFlightComputerState = FormUtils.getValueOrDefault(this.formGroup, 'state', RocketFlightComputerState.Locked)
        return state
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}