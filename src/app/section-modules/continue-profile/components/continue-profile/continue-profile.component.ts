import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { UniversityEntitiesName, UniversityStructureDynamicFormValuesMap } from 'core/modules/university/models';
import { SelectUniversityGroupComponent } from 'core/modules/university/components';
import { TranslateService } from '@ngx-translate/core';
import { RoleEnum } from 'core/models/domain/roles.model';
import { RadioButtonModel, RadioButtonsGroupControl } from 'core/modules/form-controls';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { AuthService } from 'core/modules/auth-core/services';

export type RolesFormValuesMap = {
  roles: string;
};

export enum RolesFormNames {
  roles = 'roles',
}

@Component({
  selector: 'app-continue-profile',
  templateUrl: './continue-profile.component.html',
  styleUrls: ['./continue-profile.component.scss'],
})
export class ContinueProfileComponent implements OnInit {
  private rolesRadioButtons: RadioButtonModel[] = [];

  @ViewChild('selectUniversityStructure')
  private selectUniversityStructureRef: SelectUniversityGroupComponent;

  formGroup: DynamicFormGroup<any>;

  constructor(
    private cd: ChangeDetectorRef,
    private translatService: TranslateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setRoleRadiobuttonsForm();
  }

  sendUserPhaseTwoData(): void {
    const universityStructureFormValues = this.selectUniversityStructureRef.form
      .value as UniversityStructureDynamicFormValuesMap;
    const rolesFormValues = this.formGroup.value as RolesFormValuesMap;
    debugger;
    this.authService.sendCurrentUserSecondPhaseAuthData(
      {
        [UniversityEntitiesName.faculty]: universityStructureFormValues[UniversityEntitiesName.faculty].id,
        [UniversityEntitiesName.direction]: universityStructureFormValues[UniversityEntitiesName.direction].id,
        [UniversityEntitiesName.speciality]: universityStructureFormValues[UniversityEntitiesName.speciality].direction_id
          ? null
          : universityStructureFormValues[UniversityEntitiesName.speciality].fullName,
        [UniversityEntitiesName.group]: universityStructureFormValues[UniversityEntitiesName.group].id,
      },
      rolesFormValues.roles as RoleEnum
    );
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
      [RolesFormNames.roles]: this.getFrameworksFormControlGroupDefinition(),
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