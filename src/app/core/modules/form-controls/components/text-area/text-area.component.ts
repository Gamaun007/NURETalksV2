import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [MakeProvider(TextAreaComponent)],
})
export class TextAreaComponent extends AbstractValueAccessor {
  @ViewChild('textfield')
  textfieldElement: ElementRef<HTMLInputElement>;
  textfieldElement$ = new BehaviorSubject<ElementRef<HTMLInputElement>>(null);

  constructor(private cd: ChangeDetectorRef, injector: Injector) {
    super(injector);
  }

  @HostBinding('class.dirty')
  get dirty(): boolean {
    return this.formControl?.dirty;
  }

  @HostBinding('class.invalid')
  get invalid(): boolean {
    return this.formControl?.invalid;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return this.value;
  }

  get placeholderAsTemplate(): TemplateRef<any> {
    return this.placeholderObj.value as TemplateRef<any>;
  }

  @HostBinding('class.active')
  isActive: boolean;

  @Input()
  maxLength: number;

  @Input()
  errorTexts: { [key: string]: string | (() => string) };

  @Input()
  label: string;

  @Input()
  labelParamsObj: any;

  @Input()
  required: boolean;

  @Input()
  placeholder: string | TemplateRef<any>;

  @Input()
  placeholderParamsObj: any;

  @Input()
  displayCharactersCounter: boolean;

  @Input()
  validateOnDirty = false;

  @Input()
  index: number;

  @Input()
  removable: boolean;

  @Input()
  readonly: boolean;

  @Input()
  rows: number;

  @Input()
  allowErrorsDisplay = true;

  @HostBinding('class.resizable')
  @Input()
  resizable = true;

  @Output()
  input = new EventEmitter<Event>();

  @Output()
  valueChanges = new EventEmitter<string>();

  @Output()
  removeControl: EventEmitter<string> = new EventEmitter();

  placeholderObj: { type: string; value: string | TemplateRef<any> };

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Temporary workaround
      this.textfieldElement$.next(this.textfieldElement);
    }, 0);
  }

  ngOnChanges(simpleChange: SimpleChanges): void {
    super.ngOnChanges(simpleChange);

    if ('placeholder' in simpleChange) {
      if (typeof this.placeholder === 'string') {
        this.placeholderObj = { type: 'string', value: this.placeholder };
      } else {
        this.placeholderObj = { type: 'template', value: this.placeholder };
      }
    }
  }

  focus(): void {
    this.textfieldElement.nativeElement.focus();
  }

  isTextPlaceholderType(): boolean {
    return this.placeholderObj.type === 'string';
  }

  placeholderClick(): void {
    if (!this.isDisabled) {
      this.textfieldElement.nativeElement.focus();
    }
  }

  inputBlur(): void {
    this.markAsDirty();
  }

  inputFocusIn(): void {
    this.isActive = true;
    this.cd.detectChanges();
  }

  inputFocusOut(): void {
    if (this.textfieldElement.nativeElement.value) {
      this.textfieldElement.nativeElement.value = this.textfieldElement.nativeElement.value.trim();
    }

    this.isActive = false;
    this.cd.detectChanges();
  }

  valueChangesEventEmitHandler(changes: any): void {
    if (typeof changes === 'string') {
      this.valueChanges.next(changes);
    }
  }
}
