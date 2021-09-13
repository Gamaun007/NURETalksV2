import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Component, DebugElement, Input, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ControlHeaderComponent } from '../control-header/control-header.component';
import { TextFieldComponent } from './text-field.component';

@Component({
  selector: 'app-host',
  template: `
    <form [formGroup]="formGroup">
      <app-text-field
        [id]="idForTextField"
        [formControlName]="'testControl'"
        [maxLength]="maxLength"
        [minLength]="minLength"
        [minValue]="minValue"
        [maxValue]="maxValue"
        [inputType]="inputType"
        [errorTexts]="errorTexts"
        [label]="label"
        [labelParamsObj]="labelParamsObj"
        [required]="required"
        [placeholder]="placeholder"
        [placeholderParamsObj]="placeholderParamsObj"
        [tooltipText]="tooltipText"
        [validateOnDirty]="validateOnDirty"
        [index]="index"
        [removable]="removable"
        [showHideText]="showHideText"
        [readonly]="readonly"
        [displayCharactersCounter]="displayCharactersCounter"
        (input)="input($event)"
      ></app-text-field>
    </form>
  `,
})
class HostComponent {
  control = new FormControl();
  formGroup = new FormGroup({
    testControl: this.control,
  });

  idForTextField: string;
  maxLength: number;
  minLength: number;
  minValue: number;
  maxValue: number;
  inputType;
  errorTexts: { [key: string]: string | (() => string) };
  label: string;
  labelParamsObj: any;
  required: boolean;
  placeholder: string | TemplateRef<any>;
  placeholderParamsObj: any;
  tooltipText: string;
  validateOnDirty = false;
  index: number;
  removable: boolean;
  showHideText: boolean;
  readonly: boolean;
  displayCharactersCounter: boolean;
  input = jasmine.createSpy('input');
}

describe('TextFieldComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUnderTest: TextFieldComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule],
      declarations: [HostComponent, TextFieldComponent, ControlHeaderComponent],
      providers: [],
    }).compileComponents();
  }));

  function getTextfieldDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(TextFieldComponent));
  }

  function getTextfieldNativeElement(): HTMLElement {
    return getTextfieldDebugElement().nativeElement;
  }

  function getInputNativeElement(type?: string): HTMLInputElement {
    if (type) {
      return fixture.debugElement.query(By.css(`input[type=${type}]`))?.nativeElement;
    }

    return fixture.debugElement.query(By.css(`input`))?.nativeElement;
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(TextFieldComponent)).componentInstance;
    await detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('characters counter', () => {
    const fakeMaxLength = 5;

    beforeEach(() => {
      hostComponent.maxLength = fakeMaxLength;
      hostComponent.displayCharactersCounter = true;
    });

    function getCharactersCounterDebugElement(): DebugElement {
      return getTextfieldDebugElement().query(By.css('div.characters-counter'));
    }

    function generateStringByCount(count: number): string {
      let resultString = '';

      for (let i = 0; i < count; i++) {
        resultString += 'a';
      }

      return resultString;
    }

    it('should be rendered if maxLength has value and displayCharactersCounter is true', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(getCharactersCounterDebugElement()).toBeTruthy();
    });

    it('should be rendered if displayCharactersCounter is false', async () => {
      // Arrange
      hostComponent.displayCharactersCounter = false;

      // Act
      await detectChanges();

      // Assert
      expect(getCharactersCounterDebugElement()).toBeFalsy();
    });

    it('should be rendered if maxLength does not have value displayCharactersCounter is true', async () => {
      // Arrange
      hostComponent.displayCharactersCounter = true;
      hostComponent.maxLength = undefined;

      // Act
      await detectChanges();

      // Assert
      expect(getCharactersCounterDebugElement()).toBeFalsy();
    });

    it('should render element that displays count of inputted characters', async () => {
      // Arrange
      const currentStringLength = 3;
      componentUnderTest.value = generateStringByCount(currentStringLength);

      // Act
      await detectChanges();

      // Assert
      const counter = getCharactersCounterDebugElement().query(By.css(':nth-child(1)'));
      expect(counter).toBeTruthy();
      expect(counter.nativeElement.innerText).toBe(currentStringLength.toString());
    });

    it('should render element that displays maxLength', async () => {
      // Arrange
      componentUnderTest.value = generateStringByCount(4);

      // Act
      await detectChanges();

      // Assert
      const maxLength = getCharactersCounterDebugElement().query(By.css(':nth-child(3)'));
      expect(maxLength).toBeTruthy();
      expect(maxLength.nativeElement.innerText).toBe(fakeMaxLength.toString());
    });
  });

  describe('dirty property', () => {
    it('should return false and remove "dirty" class if text-area component is not in "dirty" state', async () => {
      // Arrange
      hostComponent.control.markAsPristine();

      // Act
      fixture.detectChanges(true);
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.dirty).toBeFalsy();
      expect(getTextfieldNativeElement().classList.contains('dirty')).toBeFalsy();
    });

    it('should return true and set "dirty" class if text-area is on dirty state', async () => {
      // Arrange
      hostComponent.control.markAsDirty();

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.dirty).toBeTruthy();
      expect(getTextfieldNativeElement().classList.contains('dirty')).toBeTrue();
    });
  });

  describe('invalid property', () => {
    it('should return false and remove "invalid" class if control is valid', async () => {
      // Arrange
      hostComponent.control.setErrors(null);

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.invalid).toBeFalsy();
      expect(getTextfieldNativeElement().classList.contains('invalid')).toBeFalsy();
    });

    it('should return true and set "invalid" class if control is invalid', async () => {
      // Arrange
      hostComponent.control.setErrors({ fakeError: true });

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.invalid).toBeTruthy();
      expect(getTextfieldNativeElement().classList.contains('invalid')).toBeTruthy();
    });
  });

  describe('value property', () => {
    it('should remove "has-value" class if congrol.value is not specified', async () => {
      // Arrange
      componentUnderTest.value = undefined;

      // Act
      fixture.detectChanges(true);
      await fixture.whenStable();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('has-value')).toBeFalsy();
    });

    it('should set "has-value" class if congrol.value is specified', async () => {
      // Arrange
      componentUnderTest.value = 'fake-value';

      // Act
      await detectChanges();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('has-value')).toBeTrue();
    });
  });

  describe('isTextPlaceholderType function', () => {
    it('should return true if placeholderObj contains type string', () => {
      // Arrange
      componentUnderTest.placeholderObj = { type: 'string', value: 'any' };

      // Act
      const actual = componentUnderTest.isTextPlaceholderType();

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false if placeholderObj doesn not contain type string', () => {
      // Arrange
      componentUnderTest.placeholderObj = { type: 'any', value: 'any' };

      // Act
      const actual = componentUnderTest.isTextPlaceholderType();

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('placeholder element', () => {
    it('should be called on click event', () => {
      // Arrange
      spyOn(componentUnderTest, 'placeholderClick');

      // Act
      fixture.debugElement.query(By.css('span.placeholder')).nativeElement.dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(componentUnderTest.placeholderClick).toHaveBeenCalled();
    });
  });

  describe('inputBlur function', () => {
    it('should call markAsDirty function', () => {
      // Arrange
      spyOn(componentUnderTest, 'markAsDirty');

      // Act
      componentUnderTest.inputBlur();

      // Assert
      expect(componentUnderTest.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('inputFocusIn function', () => {
    it('should set class active for host element', async () => {
      // Act
      componentUnderTest.inputFocusIn();
      await detectChanges();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('active')).toBeTruthy();
    });

    it('should set isActive to true', async () => {
      // Act
      componentUnderTest.inputFocusIn();
      await detectChanges();

      // Assert
      expect(componentUnderTest.isActive).toBeTruthy();
    });
  });

  describe('inputFocusOut function', () => {
    it('should remove class active from host element', async () => {
      // Arrange
      getTextfieldNativeElement().classList.add('active');

      // Act
      componentUnderTest.inputFocusOut();
      await detectChanges();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('active')).toBeFalsy();
    });

    it('should set isActive to false', async () => {
      // Act
      componentUnderTest.inputFocusOut();
      await detectChanges();

      // Assert
      expect(componentUnderTest.isActive).toBeFalse();
    });
  });

  describe('placeholderClick function', () => {
    beforeEach(() => {
      spyOn(getInputNativeElement(), 'focus');
    });

    it('should focus input element when textfield is not disabled', async () => {
      // Arrange
      componentUnderTest.isDisabled = false;

      // Act
      componentUnderTest.placeholderClick();

      // Assert
      expect(getInputNativeElement().focus).toHaveBeenCalled();
    });

    it('should not focus input element when textfield is disabled', async () => {
      // Arrange
      componentUnderTest.isDisabled = true;

      // Act
      componentUnderTest.placeholderClick();

      // Assert
      expect(getInputNativeElement().focus).not.toHaveBeenCalled();
    });
  });

  describe('focusin event', () => {
    it('should call inputFocusIn function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputFocusIn');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('focusin'));

      // Assert
      expect(componentUnderTest.inputFocusIn).toHaveBeenCalled();
    });
  });

  describe('focusout event', () => {
    it('should call inputFocusOut function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputFocusOut');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('focusout'));

      // Assert
      expect(componentUnderTest.inputFocusOut).toHaveBeenCalled();
    });
  });

  describe('blur event', () => {
    it('should call inputBlur function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputBlur');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('blur'));

      // Assert
      expect(componentUnderTest.inputBlur).toHaveBeenCalled();
    });
  });

  it('should render input', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(getInputNativeElement()).toBeTruthy();
  });

  describe('`input` output', () => {
    it('should be emitted when input element changes value', async (done) => {
      const inputEvent = new InputEvent('input');

      componentUnderTest.input.subscribe((v) => {
        expect(v).toBe(inputEvent);
        done();
      });

      getInputNativeElement().dispatchEvent(inputEvent);
    });
  });

  describe('inputType property', () => {
    it('should set "text" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'text';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });

    it('should set "number" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'number';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });

    it('should set "password" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'password';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });
  });

  describe('toggleShowHide function', () => {
    it('should change input type from password to text', async () => {
      // Arrange
      hostComponent.inputType = 'password';

      // Act
      await detectChanges();
      componentUnderTest.toggleShowHide();

      // Assert
      expect(getInputNativeElement().type).toBe('text');
    });

    it('should change input type from text to password', async () => {
      // Arrange
      hostComponent.inputType = 'text';

      // Act
      await detectChanges();
      componentUnderTest.toggleShowHide();

      // Assert
      expect(getInputNativeElement().type).toBe('password');
    });
  });

  describe('focus function', () => {
    it('should focus input element', async () => {
      // Act
      await detectChanges();
      const input = getInputNativeElement();
      spyOn(input, 'focus');
      componentUnderTest.focus();

      // Assert
      expect(input.focus).toHaveBeenCalled();
    });
  });

  describe('maxLength property', () => {
    it('should set "maxlength" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.maxLength = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('maxlength');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('minValue property', () => {
    it('should set "min" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.minValue = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('min');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('maxValue property', () => {
    it('should set "max" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.maxValue = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('max');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('when id of host element is specified', () => {
    it('should set id for input', async () => {
      // Arrange
      hostComponent.idForTextField = 'fake-id';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement().id).toBe(`${hostComponent.idForTextField}-textfield`);
    });
  });
});
