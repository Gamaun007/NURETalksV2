import { TranslateService } from '@ngx-translate/core';
import { RadioButtonGroupComponent } from 'core/modules/form-controls/components/radio-button-group/radio-button-group.component';
import { RoleEnum } from 'core/models/domain/roles.model';
import { CheckBoxGroupItem, RadioButtonModel, RadioButtonsGroupControl } from 'core/modules/form-controls';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-continue-profile',
  templateUrl: './continue-profile.component.html',
  styleUrls: ['./continue-profile.component.scss'],
})
export class ContinueProfileComponent implements OnInit {
  private rolesRadioButtons: RadioButtonModel[] = [];
  formGroup: DynamicFormGroup<any>;
  constructor(private cd: ChangeDetectorRef, private translatService: TranslateService ) {}

  ngOnInit(): void {
    this.setRoleRadiobuttonsForm();
  }

  sendUserPhaseTwoData(): void {

  }

  private setRoleRadiobuttonsForm(): void {
    const allowedRolesEnumKeys = Object.keys(RoleEnum).filter(
      (key) => RoleEnum[key] === RoleEnum.Student || RoleEnum[key] === RoleEnum.UniversityStaff
    );

    allowedRolesEnumKeys.forEach((role) => {
      this.rolesRadioButtons.push({
        value: role,
        id: role,
        label: this.translatService.instant(`domain.roles.${role}`),
      });
    });

    this.formGroup = new DynamicFormGroup<any>({
      roles: this.getFrameworksFormControlGroupDefinition(),
    });
  }

  private getFrameworksFormControlGroupDefinition(): RadioButtonsGroupControl {
    return new RadioButtonsGroupControl({
      initialInputs: {
        label: this.buildTranslationKey('selectRole'),
        validateOnDirty: true,
        required: true,
        buttons: this.rolesRadioButtons,
      },
      validators: [Validators.required],
    });
  }

  buildTranslationKey(key: string): string {
    return `auth.continueProfile.${key}`;
  }
}
