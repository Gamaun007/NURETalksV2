import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, AngularSvgIconModule, TranslateModule],
  declarations: [ButtonComponent],
  exports: [ButtonComponent],
})
export class ButtonsModule {}
