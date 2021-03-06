import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Sidebar } from "primeng/sidebar";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

    display: boolean

    @ViewChild("sidebar")
    sidebar: Sidebar | undefined

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
                        label: "Constants",
                        command: () => {
                            this.navigate(['settings', 'constants'])
                        },
                        icon: 'pi pi-briefcase'
                    }
                ]
            },
            {
                label: 'Simulation',
                items: [
                    {
                        label: "Single",
                        command: () => {
                            this.navigate(['simulation', 'single'])
                        },
                        icon: 'pi pi-play'
                    },
                    {
                        label: "Multiple",
                        command: () => {
                            this.navigate(['simulation', 'multiple'])
                        },
                        icon: 'pi'
                    }
                ]
            },
            {
                label: 'Flight Data',
                items: [
                    {
                        label: "Analyzer",
                        command: () => {
                            this.navigate(['analyzer'])
                        },
                        icon: 'pi pi-chart-line'
                    }
                ]
            },
            {
                label: 'Video-Studio',
                items: [
                    {
                        label: "Transformer",
                        command: () => {
                            this.navigate(['video-studio', "transformer"])
                        },
                        icon: 'pi pi-desktop'
                    },                    
                ]
            }
        )

    }

    navigate(commands: any[]): void {
        this.display = false
        this.router.navigate(commands)

        if (this.sidebar) {
            // workaround issue with close
            this.sidebar.close({
                preventDefault: () => { }
            } as any)
        }
    }

    open(): void {
        this.display = true
    }

}