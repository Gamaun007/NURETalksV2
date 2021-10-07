import { ControlErrorsComponent, ControlHeaderComponent, DropdownOptionComponent, DropdownOptionsBackdropComponent, IndexIconComponent } from './components/atoms';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularSvgIconModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ControlErrorsComponent,
    ControlHeaderComponent,
    FileInputComponent,
    TextFieldComponent,
    IndexIconComponent,
    TextAreaComponent,
    DropdownButtonComponent,
    DropdownControlComponent,
    DropdownOptionComponent,
    DropdownOptionsBackdropComponent
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
    DropdownOptionsBackdropComponent
  ],
})
export class FormControlsModule {}
