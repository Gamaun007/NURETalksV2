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
  // {
  //   path: '',
  //   component: AuthComponent,
  //   children: [
  //     { path: 'sign-in', component: SignInPageComponent },
  //   ],
  // },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    ButtonsModule,
    TranslateModule,
    AngularSvgIconModule,
    DynamicFormModule,
  ],
  declarations: [EmailLoginComponent],
  exports: [EmailLoginComponent],
})
export class AuthenticationModule {}
