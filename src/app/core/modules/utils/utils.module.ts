import {
  SuccessAnimationComponent,
  TextComponent,
} from './components';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, LottieModule, SvgIconsModule, TranslateModule, RouterModule],
  declarations: [
    SuccessAnimationComponent,
    TextComponent,
  ],
  exports: [
    SuccessAnimationComponent,
    TextComponent,
  ],
  providers: [],
})
export class UtilsModule {}
