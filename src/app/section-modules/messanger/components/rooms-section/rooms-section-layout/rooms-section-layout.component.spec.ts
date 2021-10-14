import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsSectionLayoutComponent } from './rooms-section-layout.component';

describe('RoomsSectionLayoutComponent', () => {
  let component: RoomsSectionLayoutComponent;
  let fixture: ComponentFixture<RoomsSectionLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomsSectionLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsSectionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
