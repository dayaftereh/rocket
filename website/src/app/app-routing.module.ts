import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GlobalsSettingsComponent } from "./views/settings/globals/globals-settings.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { SimulationUtilitiesComponent } from "./views/utilities/simulation/simulation-utilities.component";
import { UtilitiesComponent } from "./views/utilities/utilities.component";

const routes: Routes = [
    {
        path: 'settings', component: SettingsComponent, children: [
            {
                path: 'globals', component: GlobalsSettingsComponent
            }
        ]
    },
    {
        path: 'utilities', component: UtilitiesComponent, children: [
            {
                path: 'simulation', component: SimulationUtilitiesComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ]
})
export class AppRoutingModule {

}