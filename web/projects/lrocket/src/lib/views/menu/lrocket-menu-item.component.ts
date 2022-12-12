import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { LRocketMenuItem } from "./lrocket-menu-item";
import { LRocketSubMenuItem } from "./lrocket-sub-menu-item";

@Component({
    selector: "lrocket-menu-item",
    templateUrl: "./lrocket-menu-item.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        "./lrocket-menu-item.component.scss"
    ],
})
export class LRocketMenuItemComponent {

    @Input()
    item: LRocketMenuItem | LRocketSubMenuItem | undefined;

    @Output()
    onItem: EventEmitter<any>;

    constructor() {
        this.onItem = new EventEmitter<any>(true);
    }

    async onClick(event: Event): Promise<void> {
        this.onItem.emit({
            event,
            item: this.item,
        });
    }

    get children(): LRocketMenuItem[] | undefined {
        if (!this.item) {
            return [];
        }

        const root: LRocketMenuItem = this.item as LRocketMenuItem;

        return root.children;
    }
}