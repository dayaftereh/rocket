import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { ConfigurationLaunchPadComponent } from './views/configuration/launch-pad/configuration-launch-pad.component';
import { ConfigurationRocketComponent } from './views/configuration/rocket/configuration-rocket.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RocketComponent } from './views/rocket/rocket.component';
import { ViewsComponent } from './views/views.component';

const routes: Routes = [
  {
    path: '', component: ViewsComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent,
      },
      {
        path: 'rocket', component: RocketComponent,
      },
      {
        path: 'configuration', component: ConfigurationComponent,
        children: [
          {
            path: 'rocket', component: ConfigurationRocketComponent,
          },
          {
            path: 'launch-pad', component: ConfigurationLaunchPadComponent,
          },
          { path: '', pathMatch: 'full', redirectTo: 'rocket' },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
