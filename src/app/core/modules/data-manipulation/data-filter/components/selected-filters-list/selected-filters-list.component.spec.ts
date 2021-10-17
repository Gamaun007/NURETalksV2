import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService } from 'core/services';
import { DataFilterManagerService, FilterDefinition, FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { FilterOptionStateWithFieldId, SelectedFiltersListComponent } from './selected-filters-list.component';

describe('SelectedFiltersListComponent', () => {
  configureTestSuite();

  let component: SelectedFiltersListComponent;
  let fixture: ComponentFixture<SelectedFiltersListComponent>;
  let filterManager: DataFilterManagerService;

  let filteringOptions: {
    [key: string]: {
      [key: string]: FilterOptionState<any>;
    };
  } = {};

  let filterDefinition: FilterDefinition<any>[] = [{} as FilterDefinition<any>];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SelectedFiltersListComponent],
      providers: [DataFilterManagerService, MessageBusService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFiltersListComponent);
    component = fixture.componentInstance;
    filterManager = TestBed.inject(DataFilterManagerService);

    spyOn(filterManager, 'getFilteringOptions').and.callFake(() => of(filteringOptions));
    spyOn(filterManager, 'getFilterDefinition').and.callFake(() => of(filterDefinition));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      filterDefinition = [
        { fieldId: 'status', displayed: false },
        { fieldId: 'plugins', displayed: true },
      ];
    });

    it('should correctly get a list of all applied options', (done) => {
      // Arrange
      filteringOptions = {
        includeNotApplicable: {
          yes: {
            checked: false,
            displayed: true,
          } as FilterOptionState<any>,
          no: {
            checked: true,
            displayed: false,
          } as FilterOptionState<any>,
        },
        status: {
          notStarted: {
            checked: true,
          } as FilterOptionState<any>,
        },
        plugins: {
          firstPlugin: {
            value: 'firstPlugin',
            checked: true,
            displayed: true,
          } as FilterOptionState<any>,
          secondPlugin: {
            value: 'secondPlugin',
            checked: true,
            displayed: true,
          } as FilterOptionState<any>,
          thirdPlugin: {
            value: 'thirdPlugin',
            checked: false,
            displayed: true,
          } as FilterOptionState<any>,
          fourthPlugin: {
            value: 'fourthPlugin',
            checked: true,
            displayed: false,
          } as FilterOptionState<any>,
        },
      };

      // Act
      fixture.detectChanges();

      // Assert
      component.filters$.subscribe((filters) => {
        expect(filters).toEqual([
          { fieldId: 'plugins', value: 'firstPlugin', checked: true, displayed: true } as FilterOptionStateWithFieldId<
            any
          >,
          { fieldId: 'plugins', value: 'secondPlugin', checked: true, displayed: true } as FilterOptionStateWithFieldId<
            any
          >,
        ]);
        done();
      });
    });
  });

  describe('#resetFilterOption', () => {
    it('should call filterManager.toggleOptions with proper filter option data', () => {
      // Arrange
      spyOn(filterManager, 'toggleOptions');
      const filter = {
        fieldId: 'some-field',
        value: 'some-value',
        optionId: 'some-option',
      } as FilterOptionStateWithFieldId<any>;

      // Act
      component.resetFilterOption(filter);

      // Assert
      expect(filterManager.toggleOptions).toHaveBeenCalledWith(filter);
    });
  });

  describe('#resetAllFilters', () => {
    it('should call filterManager.reset', () => {
      // Arrange
      spyOn(filterManager, 'reset');

      // Act
      component.resetAllFilters();

      // Assert
      expect(filterManager.reset).toHaveBeenCalled();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`core.dataFilter.${relativeKey}`);
    });
  });

  describe('class bindings', () => {
    it('should hide filters-list if no filters are applied', async () => {
      // Arrange
      filterDefinition = [{ fieldId: 'someFilter', displayed: true }];
      filteringOptions = {
        someFilter: {
          someOption: {
            checked: false,
          } as FilterOptionState<any>,
        },
      };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const filtersList = fixture.debugElement.query(By.css('.filters-list')).nativeElement;
      expect(filtersList.classList.contains('hidden')).toBeTrue();
    });
  });
});
