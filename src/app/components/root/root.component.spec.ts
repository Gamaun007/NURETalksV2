/* tslint:disable:no-unused-variable */
import { Component, EventEmitter, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AppRoutes, LoaderManagerService, MessageBusService } from 'core';
import { RootComponent } from './root.component';

@Component({
  selector: 'app-navigation-bar',
})
class NavigationBarMockComponent {
  @Output()
  logoClick = new EventEmitter();
}

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent, NavigationBarMockComponent],
      imports: [RouterTestingModule],
      providers: [LoaderManagerService, MessageBusService, { provide: router, useValue: Router }, provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy('navigate');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getNavigationBarComponent(): NavigationBarMockComponent {
    return fixture.debugElement.query(By.directive(NavigationBarMockComponent)).componentInstance;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
