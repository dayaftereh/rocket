import { Component } from "@angular/core";
import { LRocketMenuItem } from "lrocket";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls:[
        './menu.component.scss'
    ]
})
export class MenuComponent {

    visible: boolean = false

    items: LRocketMenuItem[] = [
        {
            label: 'views.menu.dashboard',
            translate: true,
            routerLink: ['dashboard']
        },
        {
            label: 'views.menu.configuration.root',
            translate: true,
            routerLink: ['configuration'],
            children: [
                {
                    label: 'views.menu.configuration.rocket',
                    translate: true,
                    routerLink: ['configuration', "rocket"]
                },
                {
                    label: 'views.menu.configuration.launch-pad',
                    translate: true,
                    routerLink: ['configuration', "launch-pad"]
                }
            ]
        }
    ]

    open(): void {
        this.visible = true;
    }

    onItemCommand(): void {
        this.visible = false;
    }

}