import { FormControlsModule } from './modules/form-controls/form-controls.module';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AppConfigService, LoaderManagerService, MessageBusService, TranslateResolverService } from './services';
import { ButtonsModule } from 'core/modules/buttons';

export const WINDOW = new InjectionToken<Window>('window');

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AngularSvgIconModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    VirtualScrollerModule,
    DynamicFormModule,
    FormControlsModule,
  ],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    FormControlsModule,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        MessageBusService,
        AppConfigService,
        LoaderManagerService,
        {
          provide: WINDOW,
          useFactory: () => window,
        },
      ],
    };
  }
}
