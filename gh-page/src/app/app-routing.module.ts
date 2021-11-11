import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnalyzerComponent } from "./views/analyzer/analyzer.component";
import { ConstantsSettingsComponent } from "./views/settings/constants/constants-settings.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { SimulationComponent } from "./views/simulation/simulation.component";
import { SingleSimulationComponent } from "./views/simulation/single/single-simulation.component";

const routes: Routes = [
    {
        path: 'settings', component: SettingsComponent, children: [
            {
                path: 'constants', component: ConstantsSettingsComponent
            }
        ]
    },
    {
        path: 'simulation', component: SimulationComponent, children: [
            {
                path: 'single', component: SingleSimulationComponent
            }
        ]
    },
    {
        path: 'analyzer', component: AnalyzerComponent
    },
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