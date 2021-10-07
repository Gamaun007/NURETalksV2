import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injector,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'app-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.scss'],
  providers: [MakeProvider(DropdownControlComponent)],
})
export class DropdownControlComponent extends AbstractValueAccessor implements AfterViewInit {
  @HostBinding('class')
  private readonly hostClasses = 'block'

  private openableElementElementRef: ElementRef<HTMLElement>;
  private previousVisibleItemsCount: number;

  @ViewChildren('openableElement', { read: ElementRef })
  private openableElementQueryList: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('trigger', { read: ElementRef })
  private dropdownButton: ElementRef<HTMLElement>

  @HostBinding('class.disabled')
  private get disabled(): boolean {
    return this.isDisabled || !this.data;
  }

  readonly buttonHeight: number = 40;
  displayedData: any[];
  isDropdownOpened = false;
  searchField = new FormControl('');

  get listWidth(): number {
    return this.isDropdownOpened ? this.dropdownButton.nativeElement.getBoundingClientRect().width : 0;
  }

  get listMaxHeight(): number {
    if (this.previousVisibleItemsCount !== this.visibleItemsCount) {
      return this.visibleItemsCount * this.buttonHeight;
    }

    return this.previousVisibleItemsCount;
  }

  @Input()
  data: any[];

  @Input()
  displayValueSelector: (x: any) => string;

  @Input()
  context: any;

  @Input()
  titleTranslationKey: string;

  @Input()
  infoTooltip: string;

  @Input()
  placeholderTranslationKey: string;

  @Input()
  searchEnabled = false;

  @Input()
  required: boolean;

  @Input()
  searchFieldPlaceholder: string;

  @Input()
  visibleItemsCount = 4;

  @Input()
  overlayPanelClass = 'dropdown-control-overlay';

  @Input()
  comingSoon = false;

  @Input()
  selectFirstValue = true;

  @Output()
  select = new EventEmitter<any>(true);

  constructor(
    injector: Injector,
    private translate: TranslateService,
    private hostElementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.openableElementQueryList.notifyOnChanges();

    this.openableElementQueryList.changes
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => (this.openableElementElementRef = this.openableElementQueryList.first));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.displayedData = this.data;

      if (this.selectFirstValue && !this.value && !this.placeholderTranslationKey && this.data.length) {
        this.selectItem(this.data[0]);
      }
    }
  }

  selectItem(selectedValue: any): void {
    this.value = selectedValue;
    this.select.emit(selectedValue);
    this.searchField.setValue('');
    this.isDropdownOpened = false;
    this.cd.detectChanges();
  }

  search(searchValue: string): void {
    this.displayedData = this.data.filter((item) => {
      const itemLabel = this.getDisplayValue(item);
      return this.translate.instant(itemLabel).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  }

  getDisplayValue(item: any): string {
    if (item) {
      return this.displayValueSelector ? this.displayValueSelector(item) : item;
    }
  }

  searchFieldClick($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  toggleDropdown(): void {
    if (this.isDropdownOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isDropdownOpened = true;
  }

  close(): void {
    this.isDropdownOpened = false;
  }

  @HostListener('window:mousedown', ['$event'])
  private windowClick(mouseEvent: MouseEvent): void {
    // Handles outside clicks to close dropdown
    if (
      this.isDropdownOpened &&
      !mouseEvent
        .composedPath()
        .some((x) => x === this.hostElementRef.nativeElement || x === this.openableElementElementRef.nativeElement)
    ) {
      this.close();
    }
  }
}
