import { RoomsModule } from './../../core/modules/rooms/rooms.module';
import { RootGuardService } from 'core/guards/root-guard/root-guard.service';
import { UniversityModule } from 'core/modules/university/university.module';
import { AuthService } from 'core/modules/auth-core/services';
import { AuthCoreModule } from 'core/modules/auth-core/auth-core.module';
import { AuthRoutes } from 'core/constants/routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
// import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { ButtonsModule } from 'core/modules/buttons';
import { ContinueProfileComponent } from './components/continue-profile/continue-profile.component';

const routes: Route[] = [
  {
    path: '',
    component: ContinueProfileComponent,
    children: [
      {
        path: AuthRoutes.ContinueProfile,

        component: ContinueProfileComponent,
      }
    ]

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
    UniversityModule,
    RoomsModule.forRoot()
  ],
  providers: [AuthService],
  declarations: [ContinueProfileComponent],
  exports: [ContinueProfileComponent],
})
export class ContinueProfileModule {}
