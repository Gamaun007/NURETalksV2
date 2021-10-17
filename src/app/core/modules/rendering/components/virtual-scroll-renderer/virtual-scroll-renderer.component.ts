import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Optional, ViewChild
} from '@angular/core';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { BaseRenderer } from '../base-renderer/base-renderer';

export const VIRTUAL_SCROLL_BUFFER = 10;
export const SCROLL_OFFSET = -100;

@Component({
  selector: 'app-virtual-scroll-renderer',
  templateUrl: './virtual-scroll-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollRendererComponent extends BaseRenderer {
  @ViewChild('scroller', { static: true })
  private virtualScroller: VirtualScrollerComponent;

  @Input() virtualScrollBuffer = VIRTUAL_SCROLL_BUFFER;
  @Input() scrollOffset: number;
  @Input() parentScroller: PerfectScrollbarComponent;

  parentScrollElement: HTMLElement;

  constructor(
    searchInstancesManagerService: SearchInstancesManagerService,
    elementRef: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef,
    @Optional() parentScroller: PerfectScrollbarComponent
  ) {
    super(searchInstancesManagerService, elementRef, cd);
    this.parentScrollElement = parentScroller?.directiveRef.elementRef.nativeElement;
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    if (this.parentScroller) {
      this.parentScrollElement = this.parentScroller.directiveRef.elementRef.nativeElement;
    }
  }

  scrollInto(item: any): void {
    this.virtualScroller.scrollInto(item, true, this.scrollOffset ?? SCROLL_OFFSET);
  }

  protected getItemsForRendering(): any[] {
    return this.filteredItems;
  }
}
