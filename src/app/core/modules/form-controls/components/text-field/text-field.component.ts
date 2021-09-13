import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Injector,
  TemplateRef,
  SimpleChanges,
  HostBinding,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';
import { BehaviorSubject } from 'rxjs';
import { MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [MakeProvider(TextFieldComponent)],
})
export class TextFieldComponent extends AbstractValueAccessor {
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

  @HostBinding('class.active')
  isActive: boolean;

  @Input()
  maxLength: number;

  @Input()
  minValue: number;

  @Input()
  maxValue: number;

  @Input()
  inputType = 'text';

  @Input()
  errorTexts: { [key: string]: string | (() => string) | TemplateRef<any> };

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
  tooltipText: string;

  @Input()
  displayCharactersCounter: boolean;

  @Input()
  validateOnDirty = false;

  @Input()
  index: number;

  @Input()
  removable: boolean;

  @Input()
  showHideText: boolean;

  @Input()
  readonly: boolean;

  @Output()
  input = new EventEmitter<InputEvent>();

  @Output()
  valueChanges = new EventEmitter<string>();

  @Output()
  removeControl: EventEmitter<string> = new EventEmitter();

  placeholderObj: { type: string; value: string | TemplateRef<any> };

  // Autocomplete related properties

  @Input()
  suggestions: Array<string>;

  @Input()
  suggestionsConfig: { maxItemsToDisplay: number };

  @Input()
  addonText: string;

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

  toggleShowHide(): void {
    const el = this.textfieldElement.nativeElement;
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
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
