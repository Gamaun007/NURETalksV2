import { AuthComponent } from './components/auth/auth.component';
import { AuthService } from 'core/modules/auth-core/services';
import { AuthCoreModule } from './../../core/modules/auth-core/auth-core.module';
import { AuthRoutes } from './../../core/constants/routes';
import { EmailCallbackComponent } from './components/email-callback/email-callback.component';
import { EmailLoginComponent } from './components/email-login/email-login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
// import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { ButtonsModule } from 'core/modules/buttons';

const routes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: AuthRoutes.SignIn,
        component: EmailLoginComponent,
      },
      { path: AuthRoutes.EmailCallback, component: EmailCallbackComponent },
      {
        path: '',
        redirectTo: AuthRoutes.SignIn,
        pathMatch: 'prefix',
      },
    ],
  },
];

@NgModule({
  imports: [
    AuthCoreModule,
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    ButtonsModule,
    TranslateModule,
    AngularSvgIconModule,
    DynamicFormModule,
  ],
  providers: [AuthService],
  declarations: [AuthComponent, EmailLoginComponent, EmailCallbackComponent],
  exports: [AuthComponent, EmailLoginComponent, EmailCallbackComponent],
})
export class AuthenticationModule {}
