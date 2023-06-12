import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: [
        './menu.component.scss'
    ]
})
export class MenuComponent {

    visible: boolean = false

    items$: Observable<MenuItem[]>

    constructor() {
        this.items$ = of(
            [
                {
                    label: 'Dashboard',
                    routerLink: ['dashboard'],
                } as MenuItem,
                {
                    label: 'Rocket',
                    routerLink: ['rocket'],
                } as MenuItem
            ],
        )
    }



    open(): void {
        this.visible = true;
    }

    onItemCommand(): void {
        this.visible = false;
    }

}