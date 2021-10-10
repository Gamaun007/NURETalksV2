import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { CheckboxComponent } from '../../components';

export class CheckBoxControl extends AbstractDynamicControl<CheckboxComponent, any, any, boolean> {
  constructor(config: ControlConfiguration<any, any, boolean>) {
    super(config, CheckboxComponent);
  }
}
