import { AbstractControl, Validators, ValidationErrors } from '@angular/forms';

const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export function url(control: AbstractControl): ValidationErrors {
  const patternErr = Validators.pattern(regexp)(control);

  if (patternErr) {
    return { url: true };
  }

  return null;
}
