import { RootComponent } from 'src/app/components';
import { WildCardComponent } from './components/wild-card/wild-card.component';
import { AuthGuardService } from './core/modules/auth-core/services';
import { AppRoutes } from './core/constants/routes';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: RootComponent,
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('./section-modules/messanger/messanger.module').then((m) => m.MessangerModule),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: AppRoutes.Auth,
    loadChildren: () =>
      import('./section-modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: '**',
    component: WildCardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
