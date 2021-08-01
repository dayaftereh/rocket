import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GlobalsSettingsComponent } from "./views/settings/globals/globals-settings.component";
import { SettingsComponent } from "./views/settings/settings.component";

const routes: Routes = [
    {
        path: 'settings', component: SettingsComponent, children: [
            {
                path: 'globals', component: GlobalsSettingsComponent
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {

}