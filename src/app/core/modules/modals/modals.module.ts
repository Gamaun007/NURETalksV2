import { ModalWindowOutletComponent } from './components/modal-window-outlet/modal-window-outlet.component';
import { UtilsModule } from 'core/modules/utils';
import { ButtonsModule } from './../buttons/buttons.module';
import { DirectivesModule } from './../directives/directives.module';
import { BaseModalComponent, ConfirmationModalWindowComponent, StatusWindowModalComponent } from './components';
import { ModalWindowService } from './services/modal-window/modal-window.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherModule } from './../component-switcher/component-switcher.module';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfirmationModalWindowComponent, StatusWindowModalComponent, BaseModalComponent, ModalWindowOutletComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgbTooltipModule,
    SvgIconsModule,
    ComponentSwitcherModule,
    RouterModule,
    NgbPopoverModule,
    DirectivesModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    ButtonsModule,
    UtilsModule,
  ],
  providers: [ModalWindowService],
  exports: [StatusWindowModalComponent, BaseModalComponent, ConfirmationModalWindowComponent, ModalWindowOutletComponent],
})
export class ModalsModule { }
