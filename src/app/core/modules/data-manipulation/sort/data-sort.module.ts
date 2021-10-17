import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataSortComponent } from './components';
import { FormControlsModule } from 'core/modules/form-controls';
import { ButtonsModule } from 'core/modules/buttons';

@NgModule({
  imports: [CommonModule, FormControlsModule, ButtonsModule],
  declarations: [DataSortComponent],
  exports: [DataSortComponent],
})
export class DataSortModule {}
