import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ControlErrorsComponent,
  ControlHeaderComponent,
  FileInputComponent,
  TextAreaComponent,
  TextFieldComponent,
  IndexIconComponentComponent,
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
    IndexIconComponentComponent,
    TextAreaComponent,
  ],
  exports: [
    ControlErrorsComponent,
    ControlHeaderComponent,
    FileInputComponent,
    TextFieldComponent,
    IndexIconComponentComponent,
    TextAreaComponent,
  ],
})
export class FormControlsModule {}
