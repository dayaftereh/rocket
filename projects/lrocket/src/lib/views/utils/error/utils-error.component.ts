import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'lrocket-utils-error',
    templateUrl: './utils-error.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UtilsErrorComponent),
        multi: true
    }],
    styleUrls: [
        './utils-error.component.scss'
    ]
})
export class UtilsErrorComponent implements ControlValueAccessor {

    error: boolean

    constructor() {
        this.error = false
    }

    writeValue(error: boolean | undefined): void {
        this.error = !!error
    }

    registerOnChange(fn: any): void {

    }

    registerOnTouched(fn: any): void {

    }

    setDisabledState(isDisabled: boolean): void {

    }

}