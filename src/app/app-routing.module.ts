import { WildCardComponent } from './core/components/wild-card/wild-card.component';
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
        children: [],
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
