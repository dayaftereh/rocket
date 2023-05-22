import { AbstractControl, FormGroup } from "@angular/forms";

export class FormUtils {

    private constructor() {

    }

    static getControl(formGroup: FormGroup, name: string): AbstractControl | undefined {
        if (!formGroup) {
            return undefined
        }

        const control: AbstractControl | null = formGroup.get(name)
        if (!control) {
            return undefined
        }

        return control
    }

    static getValue<T>(formGroup: FormGroup, name: string): T | undefined {
        const control: AbstractControl | undefined = FormUtils.getControl(formGroup, name)
        if (!control) {
            return undefined
        }
        if (control.value === undefined || control.value === null) {
            return undefined
        }
        return control.value as T
    }

    static getValueOrDefault<T>(formGroup: FormGroup, name: string, defaultValue: T): T {
        const value: T | undefined = FormUtils.getValue(formGroup, name)
        if (value === undefined || value === null) {
            return defaultValue
        }
        return value
    }

    static setControlEnable(formGroup: FormGroup, name: string, flag: boolean, opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): boolean {
        const control: AbstractControl | undefined = FormUtils.getControl(formGroup, name)

        if (!control) {
            return false
        }

        if (flag) {
            control.enable(opts)
        } else {
            control.disable(opts)
        }

        return true
    }

}