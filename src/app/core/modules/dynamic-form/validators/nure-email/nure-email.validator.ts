import { NUREUaDomain } from 'core/models/domain/nure.domain.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailNureValidator(control: AbstractControl): ValidationErrors {
  const controlValue: string = control?.value;
  const isEndWithNureUa = controlValue?.endsWith(NUREUaDomain);

  return isEndWithNureUa ? null : { emailnure: { value: control?.value } };
}
