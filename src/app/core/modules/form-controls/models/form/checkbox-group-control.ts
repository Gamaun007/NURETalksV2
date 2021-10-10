import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { CheckboxGroupComponent } from '../../components';

export class CheckBoxGroupControl extends AbstractDynamicControl<CheckboxGroupComponent, any, any, boolean> {
  constructor(config: ControlConfiguration<any, any, boolean>) {
    super(config, CheckboxGroupComponent);
  }
}
