import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewEncapsulation } from "@angular/core";
import { PrimeTemplate } from "primeng/api";
import { LRocketMenuItem } from "./lrocket-menu-item";

@Component({
    selector: "lrocket-menu",
    templateUrl: "./lrocket-menu.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './lrocket-menu.component.scss'
    ]
})
export class LRocketMenuComponent implements AfterContentInit {
    @Input()
    height: string;

    @Input()
    spacer: string;

    @Input()
    items: LRocketMenuItem[];

    @ContentChildren(PrimeTemplate)
    templates: QueryList<any>;

    @Output()
    onItem: EventEmitter<any>;

    headerTemplate: TemplateRef<any> | undefined;

    footerTemplate: TemplateRef<any> | undefined;

    constructor() {
        this.items = [];
        this.spacer = "65%";
        this.height = "90vh";
        this.templates = new QueryList<any>();
        this.onItem = new EventEmitter<any>(true);
    }

    onItemCommand(event: any): void {
        this.onItem.emit(event);
    }

    ngAfterContentInit() {
        this.injectTemplates(this.templates);
    }

    injectTemplates(templates: QueryList<any> | undefined): void {
        if (!templates) {
            return;
        }

        templates.forEach((item: PrimeTemplate) => {
            switch (item.getType()) {
                case "header":
                    this.headerTemplate = item.template;
                    break;
                case "footer":
                    this.footerTemplate = item.template;
                    break;
            }
        });
    }
}