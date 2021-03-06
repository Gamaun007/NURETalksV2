/* tslint:disable:no-unused-variable */
import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchInstancesManagerService, SearchResultsPaginationComponent } from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { VirtualScrollerComponent, VirtualScrollerModule } from 'ngx-virtual-scroller';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { VirtualScrollRendererComponent } from './virtual-scroll-renderer.component';

@Component({
  selector: '',
  template: `
    <app-virtual-scroll-renderer
      [virtualScrollBuffer]="virtualScrollBuffer"
      [scrollOffset]="scrollOffset"
      [parentScroller]="parentScroller"
      [idSelector]="idSelector"
      [buildRenderingItemsCallback]="buildRenderingItemsCallback"
      [itemAddingStream]="itemAddingStream"
      [allItemsStream]="allItemsStream"
      [filteredItemsStream]="filteredItemsStream"
      [scrollToNewlyAddedItem]="scrollToNewlyAddedItem"
      [scrollToFocusedItem]="scrollToFocusedItem"
    >
      <ng-template #itemTemplate let-item="item" let-index="index">
        <div class="item-from-template">{{ item.name }}</div>
      </ng-template>
    </app-virtual-scroll-renderer>
  `,
})
class HostComponent {
  virtualScrollBuffer: number;
  scrollOffset: number;
  parentScroller: any;
  idSelector: (item) => string;
  buildRenderingItemsCallback = jasmine.createSpy('buildRenderingItemsCallback');
  itemAddingStream = new Subject<any>();
  allItemsStream = new BehaviorSubject<any[]>([]);
  filteredItemsStream = new Subject<any[]>();
  scrollToNewlyAddedItem: boolean;
  scrollToFocusedItem: boolean;
}

describe('VirtualScrollRendererComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: VirtualScrollRendererComponent;

  let virutalScroller: VirtualScrollerComponent;
  let fakeSearchScope: string;
  let searchInstancesManagerMock: SearchInstancesManagerService;
  let searchResultsPaginationMock: SearchResultsPaginationComponent;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HostComponent, VirtualScrollRendererComponent],
        imports: [VirtualScrollerModule],
        providers: [{ provide: SearchInstancesManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(VirtualScrollRendererComponent)).componentInstance;
    virutalScroller = fixture.debugElement.query(By.directive(VirtualScrollerComponent)).componentInstance;
    hostComponent.idSelector = (_) => 'fakeId';
    searchResultsPaginationMock = {} as SearchResultsPaginationComponent;
    searchResultsPaginationMock.dataFocusChange = new EventEmitter();
    fakeSearchScope = 'fake-search-scope';
    searchInstancesManagerMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.callFake(() => fakeSearchScope);
    searchInstancesManagerMock.getSearchResultsPaginator = jasmine
      .createSpy('getSearchResultsPaginator')
      .and.callFake(() => of(searchResultsPaginationMock));
    virutalScroller.scrollInto = jasmine.createSpy('scrollInto');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(componentUnderTest).toBeTruthy();
  });

  describe('scrollInto()', () => {
    const fakeItem = {};
    beforeEach(() => detectChanges());

    it('should call virutalScroller.scrollInto with new item after 500 ms delay when new item added', () => {
      // Arrange
      // Act
      componentUnderTest.scrollInto(fakeItem);

      // Assert
      expect(virutalScroller.scrollInto).toHaveBeenCalledWith(fakeItem, jasmine.anything(), jasmine.anything());
    });

    it('should call virutalScroller.scrollInto with new item after 500 ms delay when new item added', () => {
      // Arrange
      // Act
      componentUnderTest.scrollInto(fakeItem);

      // Assert
      expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), true, jasmine.anything());
    });

    it('should call virutalScroller.scrollInto with default scroll offset when new item added', () => {
      // Arrange
      // Act
      componentUnderTest.scrollInto(fakeItem);

      // Assert
      expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), -100);
    });

    it('should call virutalScroller.scrollInto with default "scrollOffset" input when new item added', fakeAsync(() => {
      // Arrange
      const fakeOffset = 23131321313;
      hostComponent.scrollOffset = fakeOffset;
      detectChanges();
      tick(100);

      // Act
      componentUnderTest.scrollInto(fakeItem);

      // Assert
      expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), fakeOffset);
    }));
  });
});
