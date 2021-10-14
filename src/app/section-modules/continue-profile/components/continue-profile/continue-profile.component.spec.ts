import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueProfileComponent } from './continue-profile.component';

describe('ContinueProfileComponent', () => {
  let component: ContinueProfileComponent;
  let fixture: ComponentFixture<ContinueProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContinueProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
