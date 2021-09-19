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

    static getValueOrDefault<T>(formGroup: FormGroup, name: string, defaultValue: T): T {
        const control: AbstractControl | undefined = FormUtils.getControl(formGroup, name)
        if (!control) {
            return defaultValue
        }
        if (control.value === undefined || control.value === null) {
            return defaultValue
        }
        return control.value as T
    }

}