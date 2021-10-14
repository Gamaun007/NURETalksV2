import { ContinueProfileComponent } from './section-modules/continue-profile/components';
import { EmailLoginComponent } from './section-modules/authentication/components/email-login/email-login.component';
import { TranslateResolverService } from './core/services/translate-resolver/translate-resolver.service';
import { RootComponent } from 'src/app/components';
import { WildCardComponent } from './components/wild-card/wild-card.component';
import { AuthGuardService } from './core/modules/auth-core/services';
import { AppRoutes, AuthRoutes } from './core/constants/routes';
import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { UserMenuBarComponent } from 'core/components';
import { RootGuardService } from 'core/guards/root-guard/root-guard.service';

const routes = [
  {
    path: '',
    // TODO: PluginRedirectionGuardService to be removed when we migrate all customers to firebase
    canActivate: [TranslateResolverService],
    children: [
      {
        path: '',
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            children: [
              {
                path: '',
                component: RootComponent,
                canActivate: [RootGuardService],
                children: [
                  // Orederence of children routes must not be changed! 
                  {
                    path: '',
                    // canActivate: [RootGuardService],
                    loadChildren: () =>
                      import('./section-modules/messanger/messanger.module').then((m) => m.MessangerModule),
                  },
                  {
                    path: AuthRoutes.ContinueProfile,
                    // canActivate: [RootGuardService],
                    loadChildren: () =>
                      import('./section-modules/continue-profile/continue-profile.module').then(
                        (m) => m.ContinueProfileModule
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: AppRoutes.Auth,
        canActivate: [],
        loadChildren: () =>
          import('./section-modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
      },
    ],
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
