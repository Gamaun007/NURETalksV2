import { SubscriptionDetacher } from 'core/utils';
import { DropdownControlComponent } from './../../../form-controls/components/dropdown-control/dropdown-control.component';
import { Faculty } from './../../../../models/domain/university/faculty';
import { UniversityFacadeService } from './../../services/facades/university-facade/university-facade.service';
import { DynamicFormGroup } from './../../../dynamic-form/models/dynamic-form-group';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { DropdownControl } from 'core/modules/form-controls';
import { Validators } from '@angular/forms';

export type UniversityStructureDynamicForm = {
  faculty: DropdownControl;
  // subCategory?: DropdownControl;
  // controlName: TextFieldControl;
  // addDescription: TextAreaControl;
  // tsc?: MultiDropdownControl;
};

@Component({
  selector: 'app-select-university-group',
  templateUrl: './select-university-group.component.html',
  styleUrls: ['./select-university-group.component.scss'],
})
export class SelectUniversityGroupComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  form: DynamicFormGroup<UniversityStructureDynamicForm>;

  faculties: Faculty[];

  constructor(private universityFacade: UniversityFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.universityFacade
      .getFaculties()
      .pipe(
        tap((income) => (this.faculties = income)),
        take(1)
      )
      .subscribe((faculties) => {
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
    this.form = new DynamicFormGroup({
      faculty: this.selectFacultyDropdown(),
    });
  }

  private selectFacultyDropdown(): DropdownControl {
    debugger;
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.categoryLabel'),
        data: [{ name: 'First'}, { name: 'Second'}],
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.categoryPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.categorySearchPlaceholder'),
      },
      validators: [Validators.required],
    });
  }
}
