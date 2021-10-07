import { DynamicFormGroup } from './../../../dynamic-form/models/dynamic-form-group';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-university-group',
  templateUrl: './select-university-group.component.html',
  styleUrls: ['./select-university-group.component.scss'],
})
export class SelectUniversityGroupComponent implements OnInit {
  formGroup: DynamicFormGroup<any>;

  constructor() {}

  ngOnInit(): void {
    
    this.initializeFormGroup;
  }

  initializeFormGroup(): void {
    this.formGroup = new DynamicFormGroup({
      email: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('form.label'),
          placeholder: this.buildTranslationKey('form.placeholder'),
          validateOnDirty: true,
          required: true,
          // errorTexts: {
          //   // emailnure: this.buildTranslationKey('email.nureEmail'),
          //   // email: this.buildTranslationKey('email.wrongEmailFormat'),
          //   // emailNotFound: this.buildTranslationKey('email.emailNotFound'),
          // },
        },
        validators: [CustomValidators.emailNureValidator],
      }),
    });
  }
}
