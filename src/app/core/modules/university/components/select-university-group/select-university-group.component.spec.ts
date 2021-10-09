import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUniversityGroupComponent } from './select-university-group.component';

describe('SelectUniversityGroupComponent', () => {
  let component: SelectUniversityGroupComponent;
  let fixture: ComponentFixture<SelectUniversityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectUniversityGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUniversityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
