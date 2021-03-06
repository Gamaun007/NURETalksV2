import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Injector,
  Input,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioButtonModel } from '../../models';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'app-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss'],
  providers: [MakeProvider(RadioButtonGroupComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonGroupComponent extends AbstractValueAccessor {
  errorTexts: { [key: string]: string | (() => string) };
  index: number;
  validateOnDirty: boolean;
  formGroup: FormGroup;

  @Input()
  required: boolean;

  @Input()
  label: string;

  @Input()
  infoTooltip: TemplateRef<any>;

  @Input()
  infoTooltipPlacement: string;

  @Input()
  infoTooltipClass: string;

  @Input()
  labelParamsObj: any;

  @Input()
  buttons: RadioButtonModel[];

  @HostBinding('class.with-note')
  @Input()
  noteTranslationKey: () => string;

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }

  setValue(buttonIndex: number): void {
    this.value = this.buttons[buttonIndex].value;
    this.cd.detectChanges();
  }
}
