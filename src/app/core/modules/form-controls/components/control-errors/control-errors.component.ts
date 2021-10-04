import { Component, Input, Optional, TemplateRef } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-control-errors',
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.scss'],
})
export class ControlErrorsComponent {
  get control(): AbstractControl {
    return this.ngControl?.control;
  }



  @Input()
  errorTexts: object;

  constructor(@Optional() private ngControl: NgControl) {}

  buildErrorTexts(): string[] {
    if (this.errorTexts && this.control && this.control.errors) {
      return Object.keys(this.control.errors).map((errorKey) => {
        const propValue = this.errorTexts[errorKey];

        if (typeof propValue === 'function') {
          return propValue();
        } else {
          return propValue;
        }
      });
    }

    return null;
  }

  errorTextAsTemplate(error: any): TemplateRef<any> {
    return error as TemplateRef<any>;
  }

  isErrorTextTemplateRef(errText: any): boolean {
    return errText instanceof TemplateRef;
  }
}
