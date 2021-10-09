import { UniversityModule } from './modules/university/university.module';
import { DirectivesModule } from './modules/directives/directives.module';
import { ButtonsModule } from './modules/buttons/buttons.module';
import { FileStorageService } from './modules/firebase/http/file-storage.service';
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
import { GlobalLoaderComponent, TextComponent, UserMenuBarComponent } from 'core/components';
import { RoomsModule } from 'core/modules/rooms';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

export const WINDOW = new InjectionToken<Window>('window');

@NgModule({
  declarations: [GlobalLoaderComponent, UserMenuBarComponent, TextComponent],
  imports: [
    OverlayModule,
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
    ButtonsModule,
    DirectivesModule,

    // Structural entities modules
    RoomsModule,
    UniversityModule,

    // BootsTrap
    NgbPopoverModule,
    NgbTooltipModule,
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
    ButtonsModule,
    DirectivesModule,

    // Structural entities modules
    RoomsModule,
    UniversityModule,

    // Bootstrap
    NgbTooltipModule,

    // Component
    GlobalLoaderComponent,
    UserMenuBarComponent,
    TextComponent,
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
        FileStorageService,
        {
          provide: WINDOW,
          useFactory: () => window,
        },
      ],
    };
  }
}
