import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { VideoForegroundItem } from "src/app/services/video-studio/video-foreground-item";
import { FontsUtils } from "src/app/utils/fonts-utils";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-foreground-item-transformer',
    templateUrl: './foreground-item-video-studio.component.html'
})
export class ForegroundItemVideoStudioComponent implements OnInit, OnDestroy {

    fonts: SelectItem[]

    formGroup: FormGroup

    @Input()
    index: number | undefined



    @Output()
    onChanged: EventEmitter<{
        index: number,
        item: VideoForegroundItem
    }>

    @Output()
    onDelete: EventEmitter<number>

    private subscriptions: Subscription[]
    private _item: VideoForegroundItem | undefined

    constructor() {
        this.fonts = []
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
        this.onDelete = new EventEmitter<number>(true)
        this.onChanged = new EventEmitter<{
            index: number,
            item: VideoForegroundItem
        }>(true)
    }

    static defaultItem(): VideoForegroundItem {
        const fonts: string[] = FontsUtils.fonts()
        return {
            x: 0,
            y: 0,
            time: 0,
            text: '',
            duration: 0,
            fontSize: 12,
            font: fonts[0],
            fillStyle: "#000000",
            strokeStyle: "#000000",
            useFillStyle: false,
            useStrokeStyle: false,
        }
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            x: new FormControl(),
            y: new FormControl(),
            time: new FormControl(),
            font: new FormControl(),
            fontSize: new FormControl(),
            text: new FormControl(),
            duration: new FormControl(),
            fillStyle: new FormControl(),
            useFillStyle: new FormControl(),
            strokeStyle: new FormControl(),
            useStrokeStyle: new FormControl(),
        })
    }

    @Input()
    set item(item: VideoForegroundItem) {
        this._item = item
        this.formGroup.patchValue(item)
    }

    ngOnInit(): void {
        this.fonts = FontsUtils.fontsAsSelectItem()

        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription)
    }

    private onFormChanged(): void {
        const opts: any = {
            emitEvent: false,
        }

        const useFillStyle: boolean = FormUtils.getValueOrDefault(this.formGroup, "useFillStyle", false)
        FormUtils.setControlEnable(this.formGroup, "fillStyle", useFillStyle, opts)

        const useStrokeStyle: boolean = FormUtils.getValueOrDefault(this.formGroup, "useStrokeStyle", false)
        FormUtils.setControlEnable(this.formGroup, "strokeStyle", useStrokeStyle, opts)

        const item: VideoForegroundItem = this.getVideoForegroundItem()
        Object.assign(this._item, item)

        this.onChanged.next({
            item,
            index: this.index,
        })
    }

    private getVideoForegroundItem(): VideoForegroundItem {
        const defaultItem: VideoForegroundItem = ForegroundItemVideoStudioComponent.defaultItem()

        const x: number = FormUtils.getValueOrDefault(this.formGroup, "x", defaultItem.x)
        const y: number = FormUtils.getValueOrDefault(this.formGroup, "y", defaultItem.y)

        const time: number = FormUtils.getValueOrDefault(this.formGroup, "time", defaultItem.time)
        const duration: number = FormUtils.getValueOrDefault(this.formGroup, "duration", defaultItem.duration)

        const font: string = FormUtils.getValueOrDefault(this.formGroup, "font", defaultItem.font)
        const fontSize: number = FormUtils.getValueOrDefault(this.formGroup, "fontSize", defaultItem.fontSize)

        const text: string = FormUtils.getValueOrDefault(this.formGroup, "text", defaultItem.text)

        const useFillStyle: boolean = FormUtils.getValueOrDefault(this.formGroup, "useFillStyle", false)
        const fillStyle: string = FormUtils.getValueOrDefault(this.formGroup, "fillStyle", defaultItem.fillStyle)

        const useStrokeStyle: boolean = FormUtils.getValueOrDefault(this.formGroup, "useStrokeStyle", false)
        const strokeStyle: string = FormUtils.getValueOrDefault(this.formGroup, "strokeStyle", defaultItem.strokeStyle)

        return {
            x,
            y,
            time,
            font,
            text,
            fontSize,
            duration,
            fillStyle,
            strokeStyle,
            useFillStyle,
            useStrokeStyle
        }
    }

    onDeleteItem(): void {
        this.onDelete.next(this.index)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}