import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { VideoForegroundItem } from "src/app/services/video-studio/video-foreground-item";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { ForegroundItemVideoStudioComponent } from "./item/foreground-item-video-studio.component";

@Component({
    selector: 'app-foregrounds-transformer',
    templateUrl: './foregrounds-video-studio.component.html'
})
export class ForegroundsVideoStudioComponent implements OnInit {

    private static localStorageKey: string = "foregrounds-transformer-video-studio-key"

    items: VideoForegroundItem[]

    constructor(
        private readonly videoStudioService: VideoStudioService,
        private readonly localStorageService: LocalStorageService) {
        this.items = []
    }

    async ngOnInit(): Promise<void> {
        this.items = this.localStorageService.getObjectOrDefault(
            ForegroundsVideoStudioComponent.localStorageKey,
            []
        )

        await this.videoStudioService.setForegrounds(this.items)
    }

    async onAddItem(): Promise<void> {
        this.items = [
            ...this.items,
            ForegroundItemVideoStudioComponent.defaultItem()
        ]

        this.localStorageService.updateObject(
            ForegroundsVideoStudioComponent.localStorageKey,
            this.items
        )

        await this.videoStudioService.setForegrounds(this.items)
    }

    async onDeleteItem(index: number): Promise<void> {
        this.items.splice(index, 1)
        this.items = [
            ...this.items
        ]

        this.localStorageService.updateObject(
            ForegroundsVideoStudioComponent.localStorageKey,
            this.items
        )

        await this.videoStudioService.setForegrounds(this.items)
    }

    async onItemChanged(event: {
        index: number,
        item: VideoForegroundItem
    }): Promise<void> {
        this.localStorageService.updateObject(
            ForegroundsVideoStudioComponent.localStorageKey,
            this.items
        )
        await this.videoStudioService.setForegrounds(this.items)
    }

}