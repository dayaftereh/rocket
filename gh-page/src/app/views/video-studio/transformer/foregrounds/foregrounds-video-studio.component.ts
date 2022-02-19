import { Component } from "@angular/core";
import { VideoForegroundItem } from "src/app/services/video-studio/video-foreground-item";
import { VideoStudioService } from "src/app/services/video-studio/video-studio.service";
import { ForegroundItemVideoStudioComponent } from "./item/foreground-item-video-studio.component";

@Component({
    selector: 'app-foregrounds-transformer',
    templateUrl: './foregrounds-video-studio.component.html'
})
export class ForegroundsVideoStudioComponent {

    items: VideoForegroundItem[]

    constructor(private readonly videoStudioService: VideoStudioService) {
        this.items = []
    }

    async onAddItem(): Promise<void> {
        this.items = [
            ...this.items,
            ForegroundItemVideoStudioComponent.defaultItem()
        ]
        await this.videoStudioService.setForegrounds(this.items)
    }

    async onDeleteItem(index: number): Promise<void> {
        this.items.splice(index, 1)
        this.items = [
            ...this.items
        ]
        await this.videoStudioService.setForegrounds(this.items)
    }

    async onItemChanged(event: {
        index: number,
        item: VideoForegroundItem
    }): Promise<void> {
        await this.videoStudioService.setForegrounds(this.items)
    }

}