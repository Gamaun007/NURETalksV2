import { UniversityStructureByIds } from 'core/modules/university/models/university-structure.model';
import { RoomsFacadeService } from 'core/modules/rooms/services/facades/rooms-facade/rooms-facade.service';
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

  formGroup: DynamicFormGroup<any>;

  constructor(
    private translatService: TranslateService,
    private authService: AuthService,
    private roomFacade: RoomsFacadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setRoleRadiobuttonsForm();
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
      [UniversityEntitiesName.group]: universityStructureFormValues[UniversityEntitiesName.group].id,
    };

    const role = RoleEnum[rolesFormValues.roles];
    await this.authService.sendCurrentUserSecondPhaseAuthData(universityStructure, role);
    if (role === RoleEnum.Headman || role === RoleEnum.Student) {
      await this.roomFacade.createGroupRoom(universityStructure);
    }
    this.router.navigate(['/']);
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
