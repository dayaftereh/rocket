import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { VideoBackgroundOptions } from "src/app/services/video-studio/background/video-background-options";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-background-transformer',
    templateUrl: './background-transformer-video-studio.component.html'
})
export class BackgroundTransformerVideoStudioComponent implements OnInit, OnDestroy {

    formGroup: FormGroup

    @Output()
    onChanged: EventEmitter<VideoBackgroundOptions | undefined>

    private subscriptions: Subscription[]

    constructor() {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
        this.onChanged = new EventEmitter<VideoBackgroundOptions | undefined>(true)
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            enabled: new FormControl(),
        })
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription)
    }

    private onFormChanged(): void {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)

        const opts: any = {
            emitEvent: false
        }

        const options: VideoBackgroundOptions | undefined = this.getOptions()
        this.onChanged.next(options)
    }

    getOptions(): VideoBackgroundOptions | undefined {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)
        if (!enabled) {
            return undefined
        }

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}