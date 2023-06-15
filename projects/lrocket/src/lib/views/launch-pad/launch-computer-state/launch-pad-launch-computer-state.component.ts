import { Component, Input, OnDestroy, OnInit, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { LaunchPadComputerState } from "../../../services/web/messages/launch-pad-computer-state";
import { FormUtils } from "../../../utils/form-utils";

@Component({
    selector: 'lrocket-launch-computer-state',
    templateUrl: './launch-pad-launch-computer-state.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LaunchPadLaunchComputerStateComponent),
        multi: true
    }]
})
export class LaunchPadLaunchComputerStateComponent implements ControlValueAccessor, OnInit, OnDestroy {

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
        return Object.values(LaunchPadComputerState)
            .filter((value: string | LaunchPadComputerState) => {
                return typeof value !== 'number'
            })
            .map((value: string | LaunchPadComputerState) => {
                const name: string = value as string
                return name
            })
            .map((name: string) => {
                const label: string = this.lowercaseFirstLetter(name)
                const value: LaunchPadComputerState = (LaunchPadComputerState as any)[name]
                return {
                    value,
                    label,
                }
            })
    }

    private onFormChanged(): void {
        const state: LaunchPadComputerState = this.getState()

        if (this.onTouched) {
            this.onTouched()
        }

        if (this.onChange) {
            this.onChange(state)
        }
    }

    writeValue(state: LaunchPadComputerState | undefined): void {
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

    private getState(): LaunchPadComputerState {
        const state: LaunchPadComputerState = FormUtils.getValueOrDefault(this.formGroup, 'state', LaunchPadComputerState.Locked)
        return state
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}