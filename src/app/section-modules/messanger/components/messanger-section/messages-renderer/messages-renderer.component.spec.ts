import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesRendererComponent } from './messages-renderer.component';

describe('MessagesRendererComponent', () => {
  let component: MessagesRendererComponent;
  let fixture: ComponentFixture<MessagesRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
