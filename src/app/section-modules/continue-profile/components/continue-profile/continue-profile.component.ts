import { UniversityStructureByIds } from 'core/modules/university/models/university-structure.model';
import { UniversityEntitiesName, UniversityStructureDynamicFormValuesMap } from 'core/modules/university/models';
import { SelectUniversityGroupComponent } from 'core/modules/university/components';
import { TranslateService } from '@ngx-translate/core';
import { RoleEnum } from 'core/models/domain/roles.model';
import { RadioButtonModel, RadioButtonsGroupControl } from 'core/modules/form-controls';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { AuthService } from 'core/modules/auth-core/services';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

export type RolesFormValuesMap = {
  roles: string;
};

export enum RolesFormNames {
  roles = 'roles',
}

type RolesDynamicForm = {
  [RolesFormNames.roles]: RadioButtonsGroupControl;
};

@Component({
  selector: 'app-continue-profile',
  templateUrl: './continue-profile.component.html',
  styleUrls: ['./continue-profile.component.scss'],
})
export class ContinueProfileComponent implements OnInit {
  private rolesRadioButtons: RadioButtonModel[] = [];

  @ViewChild('selectUniversityStructure')
  private selectUniversityStructureRef: SelectUniversityGroupComponent;

  requestProceeding$ = new Subject<boolean>();

  formGroup: DynamicFormGroup<RolesDynamicForm>;

  get submitButtonDisabled(): boolean {
    let universityFormInvalid = this.selectUniversityStructureRef?.form?.invalid;
    if (this.selectUniversityStructureRef?.form?.invalid) {
      if (RoleEnum[this.formGroup?.items[RolesFormNames.roles].value] === RoleEnum.UniversityStaff) {
        universityFormInvalid = !this.checkIsUniveristyStaffRoleFormValid();
      }
    }

    return universityFormInvalid || this.formGroup?.invalid;
  }

  constructor(
    private translatService: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setRoleRadiobuttonsForm();
    this.setFormListeners();
  }

  private checkIsUniveristyStaffRoleFormValid(): boolean {
    const items = this.selectUniversityStructureRef.form.items;
    return !!(
      items[UniversityEntitiesName.faculty].value &&
      items[UniversityEntitiesName.direction].value &&
      items[UniversityEntitiesName.speciality].value
    );
  }

  async sendUserPhaseTwoData(): Promise<void> {
    this.requestProceeding$.next(true);
    const universityStructureFormValues = this.selectUniversityStructureRef.form
      .value as UniversityStructureDynamicFormValuesMap;
    const rolesFormValues = this.formGroup.value as RolesFormValuesMap;

    const universityStructure: UniversityStructureByIds = {
      [UniversityEntitiesName.faculty]: universityStructureFormValues[UniversityEntitiesName.faculty].id,
      [UniversityEntitiesName.direction]: universityStructureFormValues[UniversityEntitiesName.direction].id,
      [UniversityEntitiesName.speciality]: universityStructureFormValues[UniversityEntitiesName.speciality].direction_id
        ? null
        : universityStructureFormValues[UniversityEntitiesName.speciality].fullName,
      [UniversityEntitiesName.group]: universityStructureFormValues[UniversityEntitiesName.group]?.id,
    };

    const role = RoleEnum[rolesFormValues.roles];
    await this.authService.sendCurrentUserSecondPhaseAuthData(universityStructure, role);
    this.router.navigate(['/']);
  }

  private setFormListeners(): void {
    this.formGroup.items[RolesFormNames.roles].valueChanges.subscribe((role) => {
      const groupInput = this.selectUniversityStructureRef.form.items[UniversityEntitiesName.group];
      const selectedRole = RoleEnum[role] as RoleEnum;
      if (selectedRole === RoleEnum.UniversityStaff) {
        groupInput.displayed = false;
      } else {
        groupInput.displayed = true;
      }
    });
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
