import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
// import { DynamicFormModule } from 'core/modules/dynamic-form';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { ButtonsModule } from 'core/modules/buttons';
import { MessangerComponent } from './components/messanger/messanger.component';

const routes: Route[] = [
  {
    path: '',
    component: MessangerComponent,
  },
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
  providers: [],
  declarations: [MessangerComponent],
  exports: [],
})
export class MessangerModule {}
