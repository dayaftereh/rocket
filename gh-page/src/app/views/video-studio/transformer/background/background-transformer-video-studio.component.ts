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
            enabled: new FormControl(false),

            speed: new FormControl([0, 20]),
            radius: new FormControl([0, 10]),

            distance: new FormControl(0.1),
            particles: new FormControl(50),

            x: new FormControl(0),
            y: new FormControl(0),

            width: new FormControl(1920),
            height: new FormControl(1080),
        })
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })

        this.subscriptions.push(formSubscription)

        this.onFormChanged()
    }

    private onFormChanged(): void {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)

        const opts: any = {
            emitEvent: false
        }

        FormUtils.setControlEnable(this.formGroup, "speed", enabled, opts)
        FormUtils.setControlEnable(this.formGroup, "radius", enabled, opts)

        FormUtils.setControlEnable(this.formGroup, "distance", enabled, opts)
        FormUtils.setControlEnable(this.formGroup, "particles", enabled, opts)

        FormUtils.setControlEnable(this.formGroup, "x", enabled, opts)
        FormUtils.setControlEnable(this.formGroup, "y", enabled, opts)

        FormUtils.setControlEnable(this.formGroup, "width", enabled, opts)
        FormUtils.setControlEnable(this.formGroup, "height", enabled, opts)

        const options: VideoBackgroundOptions | undefined = this.getOptions()
        this.onChanged.next(options)
    }

    getOptions(): VideoBackgroundOptions | undefined {
        const enabled: boolean = FormUtils.getValueOrDefault(this.formGroup, "enabled", false)
        if (!enabled) {
            return undefined
        }

        const speed: number[] = FormUtils.getValueOrDefault(this.formGroup, "speed", [0, 1])
        const radius: number[] = FormUtils.getValueOrDefault(this.formGroup, "radius", [0, 1])

        const distance: number = FormUtils.getValueOrDefault(this.formGroup, "distance", 0.1)
        const particles: number = FormUtils.getValueOrDefault(this.formGroup, "particles", 50)

        const x: number = FormUtils.getValueOrDefault(this.formGroup, "x", 0)
        const y: number = FormUtils.getValueOrDefault(this.formGroup, "y", 0)

        const width: number = FormUtils.getValueOrDefault(this.formGroup, "width", 200)
        const height: number = FormUtils.getValueOrDefault(this.formGroup, "height", 200)

        return {
            x,
            y,
            width,
            height,
            particles,
            radiusMinimum: radius[0],
            radiusMaximum: radius[1],
            speedMinimum: speed[0],
            speedMaximum: speed[1],
            distance: width * distance,
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}