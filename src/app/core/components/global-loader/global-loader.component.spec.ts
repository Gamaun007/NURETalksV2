import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { GlobalLoaderComponent, LOADING_TIMEOUT } from './global-loader.component';

describe('GlobalLoaderComponent', () => {
  configureTestSuite();

  let component: GlobalLoaderComponent;
  let fixture: ComponentFixture<GlobalLoaderComponent>;
  const loaderStream$ = new BehaviorSubject(false);

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalLoaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LoaderManagerService, useValue: { loaderStream$: loaderStream$.pipe() } }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLoaderComponent);
    component = fixture.componentInstance;
    loaderStream$.next(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loader display', () => {
    it('should set hidden class on div.wrapper if loader should not be displayed', async () => {
      // Act
      await detectChanges();

      // Assert
      const wrapper = fixture.debugElement.query(By.css('div.wrapper'));
      expect(wrapper.nativeElement.classList.contains('hidden')).toBeTruthy();
    });

    it('should remove hidden class from div.wrapper if loader should be displayed', async () => {
      // Arrange
      let wrapper = fixture.debugElement.query(By.css('div.wrapper'));
      wrapper.nativeElement.classList.add('hidden');

      // Act
      await detectChanges();
      loaderStream$.next(true);
      await detectChanges();

      // Assert
      wrapper = fixture.debugElement.query(By.css('div.wrapper'));
      expect(wrapper.nativeElement.classList.contains('hidden')).toBeFalsy();
    });
  });

  describe('long loading time text display', () => {
    it('should set class invisible to div.long-loading-text after loader show', async () => {
      // Act
      await detectChanges();
      loaderStream$.next(true);
      await detectChanges();

      // Assert
      const textWrapper = fixture.debugElement.query(By.css('div.long-loading-text'));
      expect(textWrapper.nativeElement.classList.contains('invisible')).toBeTruthy();
    });

    it(`should remove class invisible from div.long-loading-text after loader has already been shown for ${LOADING_TIMEOUT} seconds`, fakeAsync(async () => {
      // Arrange
      let textWrapper = fixture.debugElement.query(By.css('div.long-loading-text'));
      textWrapper.nativeElement.classList.add('invisible');

      // Act
      await detectChanges();
      loaderStream$.next(true);
      tick(LOADING_TIMEOUT);
      await detectChanges();

      // Assert
      textWrapper = fixture.debugElement.query(By.css('div.long-loading-text'));
      expect(textWrapper.nativeElement.classList.contains('invisible')).toBeFalsy();
    }));

    it(`should set class invisible to div.long-loading-text after loader hide`, fakeAsync(async () => {
      // Act
      await detectChanges();
      loaderStream$.next(true);
      tick(LOADING_TIMEOUT + 1000);
      loaderStream$.next(false);
      await detectChanges();

      // Assert
      const textWrapper = fixture.debugElement.query(By.css('div.long-loading-text'));
      expect(textWrapper.nativeElement.classList.contains('invisible')).toBeTruthy();
    }));
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`core.globalLoader.${relativeKey}`);
    });
  });
});
