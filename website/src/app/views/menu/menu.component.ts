import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

    display: boolean

    items: MenuItem[];

    constructor(private readonly router: Router) {
        this.items = []
        this.display = false
    }

    ngOnInit(): void {
        this.items.push(
            {
                label: 'Settings',
                items: [
                    {
                        label: "Globals",
                        command: () => {
                            this.navigate(['settings', 'globals'])
                        },
                        icon: 'pi pi-briefcase'
                    }
                ]
            },
            {
                label: 'Utilities',
                items: [
                    {
                        label: "Simulation",
                        command: () => {
                            this.navigate(['utilities', 'simulation'])
                        },
                        icon: 'pi pi-desktop'
                    }
                ]
            }
        )
    }

    navigate(commands: any[]): void {
        this.display = false
        this.router.navigate(commands)
    }

    open(): void {
        this.display = true
    }

}