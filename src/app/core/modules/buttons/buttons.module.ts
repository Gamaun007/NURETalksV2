import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, IconButtonComponent } from './components';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, AngularSvgIconModule, TranslateModule],
  declarations: [ButtonComponent, IconButtonComponent],
  exports: [ButtonComponent, IconButtonComponent],
})
export class ButtonsModule {}
