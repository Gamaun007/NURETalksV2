import { Component, ElementRef, Injector, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MakeProvider } from '../abstract-value-accessor/abstract-value-accessor';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [MakeProvider(FileInputComponent)],
})
export class FileInputComponent extends AbstractValueAccessor {
  @ViewChild('fileUploadField')
  private fileUploadField: ElementRef<HTMLInputElement>;

  @Input()
  errorTexts: { [key: string]: string | (() => string) };

  @Input()
  required: boolean;

  @Input()
  label: string;

  @Input()
  index: number;

  @Input()
  validateOnDirty = false;

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }

  uploadFile(): void {
    this.value = this.fileUploadField.nativeElement.files;
  }

  buildTranslationKey(relativeKey: string): string {
    return `dynamicForm.fileInput.${relativeKey}`;
  }

  selectFile(event: any): void {
    this.fileUploadField.nativeElement.click();
  }
}
