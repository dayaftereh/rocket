import { DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as FileSaver from "file-saver";
import { SelectItem } from "primeng/api";
import { FormUtils } from "../../../utils/form-utils";

@Component({
    selector: 'app-csv-exporter-utilities',
    templateUrl: './csv-exporter-utilities.component.html'
})
export class CSVExporterUtilitiesComponent {

    formGroup: FormGroup

    newlines: SelectItem[]

    locales: SelectItem[]

    separators: SelectItem[]

    private data: any[][]

    constructor(private readonly decimalPipe: DecimalPipe) {
        this.data = []
        this.locales = []
        this.newlines = []
        this.separators = []
        this.formGroup = this.create()
    }

    private create(): FormGroup {
        return new FormGroup({
            locale: new FormControl('de'),
            newline: new FormControl('\n'),
            separator: new FormControl(';'),
            filename: new FormControl('result.csv'),
        })
    }

    ngOnInit(): void {
        this.separators.push(
            {
                label: ';',
                value: ';'
            },
            {
                label: 'Tab',
                value: '\n'
            },
            {
                label: 'Whitespace',
                value: ' '
            },
        )

        this.newlines.push(
            {
                label: '\\n',
                value: '\n'
            },
            {
                label: '\\n\\r',
                value: '\n\r'
            },
            {
                label: '\\r',
                value: '\r'
            }
        )

        this.locales.push(
            {
                label: 'DE',
                value: 'de'
            },
            {
                label: 'EN',
                value: 'en'
            }
        )
    }

    setData(data: any[][]): void {
        this.data = data
    }

    setFilename(filename: string): void {
        this.formGroup.patchValue({
            filename
        })
    }

    private isNumber(x: unknown): boolean {
        return typeof x === 'number' || x instanceof Number
    }

    private formatNumber(x: any, locale: string): string {
        const n: string | null = this.decimalPipe.transform(x, undefined, locale)
        if (n === null || n === undefined) {
            return `${x}`
        }

        return n
    }

    private formatValue(x: any, locale: string): string {
        if (this.isNumber(x)) {
            return this.formatNumber(x, locale)
        }

        return `${x}`
    }

    async onSubmit(): Promise<void> {
        const newline: string = FormUtils.getValueOrDefault(this.formGroup, 'newline', '\n')
        const locale: string = FormUtils.getValueOrDefault(this.formGroup, 'locale', 'de-DE')
        const separator: string = FormUtils.getValueOrDefault(this.formGroup, 'separator', ';')
        const filename: string = FormUtils.getValueOrDefault(this.formGroup, 'filename', 'result.csv')

        const lines: string[] = this.data.map((line: any[]) => {
            return line.map((value: any) => {
                return this.formatValue(value, locale)
            }).join(separator)
        })

        const content: string = lines.join(newline)
        const blob: Blob = new Blob([content])

        FileSaver.saveAs(blob, filename)
    }

}