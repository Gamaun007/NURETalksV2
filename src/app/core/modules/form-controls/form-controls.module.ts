import {
  AutocompleteComponent,
  CharactersCounterComponent,
  ClearButtonComponent,
  ControlErrorsComponent,
  ControlHeaderComponent,
  ControlPlaceholderComponent,
  DropdownOptionComponent,
  DropdownOptionsBackdropComponent,
  IndexIconComponent,
} from './components/atoms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropdownButtonComponent,
  DropdownControlComponent,
  FileInputComponent,
  TextAreaComponent,
  TextFieldComponent,
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'core/modules/directives/directives.module';

@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    FormsModule,
    AngularSvgIconModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    DirectivesModule,
    NgbTooltipModule,
  ],
  declarations: [
    FileInputComponent,
    TextFieldComponent,
    IndexIconComponent,
    TextAreaComponent,
    DropdownButtonComponent,
    DropdownControlComponent,

    // Atoms
    DropdownOptionComponent,
    DropdownOptionsBackdropComponent,
    ControlErrorsComponent,
    ControlHeaderComponent,
    AutocompleteComponent,
    ControlPlaceholderComponent,
    ClearButtonComponent,
    CharactersCounterComponent,
  ],
  exports: [
    ControlErrorsComponent,
    ControlHeaderComponent,
    FileInputComponent,
    TextFieldComponent,
    IndexIconComponent,
    TextAreaComponent,
    DropdownButtonComponent,
    DropdownControlComponent,
    DropdownOptionComponent,
    DropdownOptionsBackdropComponent,
    AutocompleteComponent,
    ControlPlaceholderComponent,
    ClearButtonComponent,
    CharactersCounterComponent,
  ],
})
export class FormControlsModule {}
