import { LoadersModule } from './modules/loaders';
import { FormControlsModule } from './modules/form-controls/form-controls.module';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AppConfigService, LoaderManagerService, MessageBusService } from './services';
import { LoggerService } from 'core/services';
import { GlobalLoaderComponent } from 'core/components';

export const WINDOW = new InjectionToken<Window>('window');

@NgModule({
  declarations: [GlobalLoaderComponent],
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
    LoadersModule,
  ],
  exports: [
    // Modules
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    FormControlsModule,
    LoadersModule,

    // Component
    GlobalLoaderComponent,
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
        LoggerService,
        {
          provide: WINDOW,
          useFactory: () => window,
        },
      ],
    };
  }
}
