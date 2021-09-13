/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndexIconComponentComponent } from './index-icon-component.component';

describe('IndexIconComponentComponent', () => {
  let component: IndexIconComponentComponent;
  let fixture: ComponentFixture<IndexIconComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndexIconComponentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexIconComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
