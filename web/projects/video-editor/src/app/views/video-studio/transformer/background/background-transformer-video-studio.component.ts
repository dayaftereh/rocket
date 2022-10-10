import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { VideoBackgroundOptions } from "src/app/services/video-studio/background/video-background-options";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { FormUtils } from "src/app/utils/form-utils";

@Component({
    selector: 'app-background-transformer',
    templateUrl: './background-transformer-video-studio.component.html'
})
export class BackgroundTransformerVideoStudioComponent implements OnInit, OnDestroy {

    private static localStorageKey: string = "background-transformer-video-studio-key"

    formGroup: FormGroup

    private subscriptions: Subscription[]

    constructor(
        private readonly videoStudioService: VideoStudioService,
        private readonly localStorageService: LocalStorageService) {
        this.subscriptions = []
        this.formGroup = this.createFormGroup()
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            color: new FormControl(),
            visible: new FormControl(false),

            speed: new FormControl([0, 20]),
            radius: new FormControl([0, 10]),

            distance: new FormControl(0.1),
            particles: new FormControl(50),
        })
    }

    private defaultVideoBackgroundOptions(): VideoBackgroundOptions {
        return {
            particles: 50,
            visible: false,
            distance: 0.1,
            color: '#2a323d',
            radiusMinimum: 2,
            radiusMaximum: 7,
            speedMinimum: 5,
            speedMaximum: 12,
        }
    }

    ngOnInit(): void {
        const formSubscription: Subscription = this.formGroup.valueChanges.subscribe(() => {
            this.onFormChanged()
        })
        this.subscriptions.push(formSubscription)

        const videoBackgroundOptions: VideoBackgroundOptions = this.localStorageService.getObjectOrDefault(
            BackgroundTransformerVideoStudioComponent.localStorageKey,
            this.defaultVideoBackgroundOptions()
        )
        this.formGroup.patchValue(Object.assign({}, videoBackgroundOptions, {
            speed: [
                videoBackgroundOptions.speedMinimum,
                videoBackgroundOptions.speedMaximum
            ],
            radius: [
                videoBackgroundOptions.radiusMinimum,
                videoBackgroundOptions.radiusMaximum
            ]
        }))
    }

    private onFormChanged(): void {
        const visible: boolean = FormUtils.getValueOrDefault(this.formGroup, "visible", false)

        const opts: any = {
            emitEvent: false
        }

        FormUtils.setControlEnable(this.formGroup, "speed", visible, opts)
        FormUtils.setControlEnable(this.formGroup, "radius", visible, opts)

        FormUtils.setControlEnable(this.formGroup, "distance", visible, opts)
        FormUtils.setControlEnable(this.formGroup, "particles", visible, opts)

        const options: VideoBackgroundOptions = this.getOptions()
        this.localStorageService.updateObject(
            BackgroundTransformerVideoStudioComponent.localStorageKey,
            options,
        )
        this.videoStudioService.setBackground(options)
    }

    private getOptions(): VideoBackgroundOptions {
        const defaultVideoBackgroundOptions: VideoBackgroundOptions = this.defaultVideoBackgroundOptions()

        const visible: boolean = FormUtils.getValueOrDefault(this.formGroup, "visible", defaultVideoBackgroundOptions.visible)

        const speed: number[] = FormUtils.getValueOrDefault(this.formGroup, "speed", [
            defaultVideoBackgroundOptions.speedMinimum,
            defaultVideoBackgroundOptions.speedMaximum
        ])
        const radius: number[] = FormUtils.getValueOrDefault(this.formGroup, "radius", [
            defaultVideoBackgroundOptions.radiusMinimum,
            defaultVideoBackgroundOptions.radiusMaximum
        ])

        const distance: number = FormUtils.getValueOrDefault(this.formGroup, "distance", defaultVideoBackgroundOptions.distance)
        const particles: number = FormUtils.getValueOrDefault(this.formGroup, "particles", defaultVideoBackgroundOptions.particles)

        const color: string = FormUtils.getValueOrDefault(this.formGroup, "color", defaultVideoBackgroundOptions.color)

        return {
            color,
            visible,
            particles,
            distance: distance,
            radiusMinimum: radius[0],
            radiusMaximum: radius[1],
            speedMinimum: speed[0],
            speedMaximum: speed[1],
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe()
        })
    }

}