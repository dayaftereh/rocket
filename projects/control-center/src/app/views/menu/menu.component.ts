import { Component } from "@angular/core";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: [
        './menu.component.scss'
    ]
})
export class MenuComponent {

    visible: boolean = false

    constructor() {

    }

    open(): void {
        this.visible = true;
    }

    onItemCommand(): void {
        this.visible = false;
    }

}