import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsRendererComponent } from './rooms-renderer.component';

describe('RoomsRendererComponent', () => {
  let component: RoomsRendererComponent;
  let fixture: ComponentFixture<RoomsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomsRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
