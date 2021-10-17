import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataSortComponent, SortOrderBy } from './data-sort.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { SortDefinition } from '../../models';
import { NavigationExtras, Params, Router } from '@angular/router';

interface TestEntity {
  status: boolean;
  name: string;
}

class MockRouter {
  routerState: {
    snapshot: {
      root: {
        queryParams: Params;
      };
    };
  };

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }

  constructor() {
    this.routerState = { snapshot: { root: { queryParams: {} } } };
  }
}

describe('DataSortComponent', () => {
  configureTestSuite();
  let component: DataSortComponent;
  let fixture: ComponentFixture<DataSortComponent>;

  let sortDefinitionInput: SortDefinition<TestEntity>[];
  let sortDataInput: TestEntity[];

  let router: MockRouter;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatMenuModule, RouterTestingModule],
      providers: [{ provide: Router, useClass: MockRouter }, TranslateService],
      declarations: [DataSortComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    sortDefinitionInput = [
      {
        id: 'name',
        translationKey: 'testNameKey',
        propertySelector: (c) => c.name,
      },
      {
        translationKey: 'testStatusKey',
        id: 'status',
        propertySelector: (c) => c.status,
      },
    ];
    sortDataInput = [
      {
        name: 'FirstName',
        status: true,
      },
      {
        name: 'SecondName',
        status: true,
      },
      {
        name: 'ThirdName',
        status: false,
      },
    ];

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DataSortComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set selectedItem property and call selectSort method when all data provided', async () => {
      // Arrange
      const changes: SimpleChanges = {
        sortDefinitions: new SimpleChange(null, sortDefinitionInput, true),
        data: new SimpleChange(null, sortDataInput, true)
      };
      component.data = sortDataInput;
      component.sortDefinitions = sortDefinitionInput;

      spyOn(component, 'selectSort');

      // Act
      component.ngOnChanges(changes);
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.selectedItem).toBe(sortDefinitionInput[0]);
      expect(component.selectedItem).toBeTruthy();
      expect(component.dataToMakeOperations).toEqual(sortDataInput);
      expect(component.selectSort).toHaveBeenCalledWith(component.selectedItem);
    });
  });

  describe('#ngOnInit', () => {
    it('should sort elements if sortedBy route param defined and matches with any provided sortDefinition', async () => {
      // Arrange
      router.routerState.snapshot.root.queryParams = { sortedBy: 'name' };

      component.sortDefinitions = sortDefinitionInput;

      spyOn(component, 'selectSort');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.selectSort).toHaveBeenCalledWith(sortDefinitionInput.find((def) => def.id === 'name'));
    });

    it('should not call selectSort if sortedBy route param not matches with any provided sortDefinition', async () => {
      // Arrange
      router.routerState.snapshot.root.queryParams = { sortedBy: 'notExistedElement' };

      component.sortDefinitions = sortDefinitionInput;

      spyOn(component, 'selectSort');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.selectSort).not.toHaveBeenCalled();
    });
  });

  describe('#selectSort', () => {
    it('should add sortedBy query param and emit sorted value', async () => {
      // Arrange
      spyOn(router, 'navigate');
      spyOn(component.sort, 'emit');
      component.dataToMakeOperations = sortDataInput;

      const selectedDef = sortDefinitionInput[0];
      component.dataToMakeOperations = sortDataInput;

      // Act
      component.selectSort(selectedDef);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: jasmine.objectContaining({ sortedBy: selectedDef.id }),
      });
      expect(component.selectedItem).toEqual(selectedDef);
      expect(component.sort.emit).toHaveBeenCalledWith(jasmine.arrayContaining(sortDataInput));
    });

    it(`should reverse values when selectedOrderBy is ${SortOrderBy.DESC}`, async () => {
      // Arrange
      spyOn(component.sort, 'emit');
      component.data = sortDataInput;
      component.selectedOrderBy = SortOrderBy.DESC;
      const changes: SimpleChanges = {
        data: new SimpleChange(null, sortDataInput, true),
      };
      const reversedValue = sortDataInput.slice().reverse();
      const selectedDef = sortDefinitionInput[0];

      // Act
      fixture.detectChanges();
      component.ngOnChanges(changes);
      await fixture.whenStable();

      component.selectSort(selectedDef);

      // Assert
      expect(component.dataToMakeOperations).toEqual(reversedValue);
      expect(component.sort.emit).toHaveBeenCalledWith(reversedValue);
      expect(component.selectedOrderBy).toBe(SortOrderBy.DESC);
    });

    it(`should emit empty array if no data provided when sorting`, async () => {
      // Arrange
      spyOn(component.sort, 'emit');
      component.data = null;

      const selectedDef = sortDefinitionInput[0];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.selectSort(selectedDef);

      // Assert
      expect(component.sort.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('#changeDirection', () => {
    it('should emit reversed passed value', async () => {
      // Arrange
      spyOn(component.sort, 'emit');
      component.data = sortDataInput;
      const changes: SimpleChanges = {
        data: new SimpleChange(null, sortDataInput, true),
      };
      const reversedValue = sortDataInput.slice().reverse();

      // Act
      fixture.detectChanges();
      component.ngOnChanges(changes);
      await fixture.whenStable();

      component.changeDirection();

      // Assert
      expect(component.dataToMakeOperations).toEqual(reversedValue);
      expect(component.sort.emit).toHaveBeenCalledWith(reversedValue);
      expect(component.selectedOrderBy).toBe(SortOrderBy.DESC);
    });
  });

  // describe('#changeDirection', () => {
  //   it('should emit reversed value', async () => {
  //     // Arrange
  //     spyOn(component.reverseSortData, 'emit');
  //     component.data = sortDataInput;

  //     const reversedValue = sortDataInput.reverse();

  //     // Act
  //     component.changeDirection();

  //     // Assert
  //     expect(component.reverseSortData.emit).toHaveBeenCalledWith(jasmine.arrayContaining(reversedValue));
  //   });
  // });
});
