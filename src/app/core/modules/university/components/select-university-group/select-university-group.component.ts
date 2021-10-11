import { TranslateService } from '@ngx-translate/core';
import { Group } from './../../../../models/domain/university/group';
import { Speciality } from './../../../../models/domain/university/speciality';
import { Direction } from './../../../../models/domain/university/direction';
import { SubscriptionDetacher } from 'core/utils';
import { DropdownControlComponent } from './../../../form-controls/components/dropdown-control/dropdown-control.component';
import { Faculty } from './../../../../models/domain/university/faculty';
import { UniversityFacadeService } from './../../services/facades/university-facade/university-facade.service';
import { DynamicFormGroup } from './../../../dynamic-form/models/dynamic-form-group';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { take, tap, filter } from 'rxjs/operators';
import { DropdownControl } from 'core/modules/form-controls';
import { Validators } from '@angular/forms';
import { DirectionAsSpeciality, UniversityStructureDynamicForm } from '../../models';

const directionAsSpecialityTranslationKey = 'form.specialityByDirection';

@Component({
  selector: 'app-select-university-group',
  templateUrl: './select-university-group.component.html',
  styleUrls: ['./select-university-group.component.scss'],
})
export class SelectUniversityGroupComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private readonly directionAsSpecialityTranslation: string;

  private _form: DynamicFormGroup<UniversityStructureDynamicForm>;

  get form(): DynamicFormGroup<UniversityStructureDynamicForm> {
    return this._form;
  }

  private faculties: Faculty[];

  constructor(
    private universityFacade: UniversityFacadeService,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.directionAsSpecialityTranslation = this.translateService.instant(
      this.buildTranslationKey(directionAsSpecialityTranslationKey)
    );
  }

  ngOnInit(): void {
    this.universityFacade
      .getFaculties()
      .pipe(
        tap((income) => (this.faculties = income)),
        take(1)
      )
      .subscribe((_) => {
        this.initializeFormGroup();
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(partialKey: string): string {
    return `university.${partialKey}`;
  }

  initializeFormGroup(): void {
    this._form = new DynamicFormGroup({
      faculty: this.selectFacultyDropdown(),
      direction: this.selectDirectionDropdown(),
      speciality: this.selectSpecialityDropdown(),
      group: this.selectGroupDropdown(),
    });

    this.setFormValueChangesListener();
  }

  private setFormValueChangesListener(): void {
    this.form.items.faculty.valueChanges.subscribe((faculties: Faculty) => {
      this.form.items.direction.setValue(null);
      this.form.items.speciality.setValue(null);
      this.form.items.group.setValue(null);

      this.form.items.speciality.inputs.data = [];
      this.form.items.group.inputs.data = [];

      this.form.items.speciality.inputs.isDisabled = true;
      this.form.items.group.inputs.isDisabled = true;
      this.form.items.direction.inputs.isDisabled = false;

      this.form.items.direction.inputs.data = faculties.directions;
      this.cd.detectChanges();
    });

    this.form.items.direction.valueChanges
      .pipe(filter((direction) => !!direction))
      .subscribe((direction: Direction) => {
        this.form.items.group.setValue(null);
        this.form.items.group.inputs.isDisabled = true;

        this.form.items.speciality.setValue(null);
        this.form.items.speciality.inputs.isDisabled = false;

        if (direction.groups?.length) {
          const directionShadowedAsSpeciality: DirectionAsSpeciality = {
            fullName: this.directionAsSpecialityTranslation,
            groups: direction.groups,
            direction_id: direction.id,
          };

          this.form.items.speciality.inputs.data = [directionShadowedAsSpeciality, ...direction.specialities];
        } else {
          this.form.items.speciality.inputs.data = direction.specialities;
        }
        this.cd.detectChanges();
      });

    this.form.items.speciality.valueChanges
      .pipe(filter((speciality) => !!speciality))
      .subscribe((speciality: Speciality) => {
        this.form.items.group.setValue(null);
        this.form.items.group.inputs.isDisabled = false;

        this.form.items.group.inputs.data = speciality.groups;
        this.cd.detectChanges();
      });
  }

  private selectFacultyDropdown(): DropdownControl {
    debugger;
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.selectFaculty'),
        data: this.faculties,
        displayValueSelector: (f: Faculty) => f.fullName,
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.selectFacultyPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.selectFacultyPlaceholder'),
      },
      validators: [Validators.required],
    });
  }

  private selectDirectionDropdown(): DropdownControl {
    debugger;
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.selectDirection'),
        data: [],
        isDisabled: true,
        displayValueSelector: (f: Direction) => f.fullName,
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.selectDirectionPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.selectDirectionPlaceholder'),
      },
      validators: [Validators.required],
    });
  }

  private selectSpecialityDropdown(): DropdownControl {
    debugger;
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.selectSpeciality'),
        data: [],
        isDisabled: true,
        displayValueSelector: (f: Speciality) => f.fullName,
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.selectSpecialityPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.selectSpecialityPlaceholder'),
      },
      validators: [Validators.required],
    });
  }

  private selectGroupDropdown(): DropdownControl {
    debugger;
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.selectGroup'),
        data: [],
        isDisabled: true,
        displayValueSelector: (f: Group) => f.name,
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.selectGroupPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.selectGroupPlaceholder'),
      },
      validators: [Validators.required],
    });
  }
}
