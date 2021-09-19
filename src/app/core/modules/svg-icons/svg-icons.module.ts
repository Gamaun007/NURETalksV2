import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule, SvgLoader } from 'angular-svg-icon';
import { SvgLoaderService } from './services';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  exports: [AngularSvgIconModule],
})
export class SvgIconsModule {
  static forRoot(): ModuleWithProviders<SvgIconsModule> {
    return {
      ngModule: SvgIconsModule,
      providers: [{ provide: SvgLoader, useClass: SvgLoaderService }],
    };
  }
}
