import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'lrocket-utils-connected',
    templateUrl: './utils-connected.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UtilsConnectedComponent),
        multi: true
    }],
    styleUrls: [
        './utils-connected.component.scss'
    ]
})
export class UtilsConnectedComponent implements ControlValueAccessor {

    connected: boolean

    constructor() {
        this.connected = false
    }

    writeValue(connected: boolean | undefined): void {
        this.connected = !!connected
    }

    registerOnChange(fn: any): void {

    }

    registerOnTouched(fn: any): void {

    }

    setDisabledState(isDisabled: boolean): void {

    }

}