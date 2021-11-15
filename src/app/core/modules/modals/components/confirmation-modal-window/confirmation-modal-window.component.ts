import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ConfirmationModalWindowInputKeys,
  ConfirmationModalWindowSharedContext,
  ConfirmationModalWindowSharedContextInputKeys,
} from 'core/modules/modals/components/confirmation-modal-window/constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { filter, take } from 'rxjs/operators';
import { ModalWindowService } from '../../services';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss'],
})
@Input()
export class ConfirmationModalWindowComponent implements OnInit {
  private contextData: ConfirmationModalWindowSharedContext;

  @Input(ConfirmationModalWindowInputKeys.confirmTranslationKey)
  confirmTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.dismissTranslationKey)
  dismissTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.questionTranslationKey)
  questionTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.questionTranslationParams)
  questionTranslationParams: any;

  @Input(ConfirmationModalWindowInputKeys.aftermathTranslationKey)
  aftermathTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.aftermathTemplate)
  aftermathTemplate: TemplateRef<any>;

  @Input(ConfirmationModalWindowInputKeys.icon)
  icon: string;

  @Input(ConfirmationModalWindowInputKeys.confirmationHandlerFunction)
  confirmationHandlerFunction: () => Promise<void>;

  @Input(ConfirmationModalWindowInputKeys.dismissHandlerFunction)
  dismissHandlerFunction: () => Promise<void>;

  @Input(ConfirmationModalWindowInputKeys.successWindowSwitcherId)
  successWindowSwitcherId: string;

  @Input(ConfirmationModalWindowInputKeys.errorWindowSwitcherId)
  errorWindowSwitcherId: string;

  @Output()
  confirmClick = new EventEmitter(true);

  @Output()
  dismissClick = new EventEmitter(true);

  isLoading: boolean;

  constructor(
    private modalWindowService: ModalWindowService,
    @Optional() private switcher: ComponentSwitcherDirective,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.switcher?.sharedContext$) {
      this.getSwitcherContextData();
    }
  }

  async confirm(): Promise<void> {
    if (this.contextData) {
      this.isLoading = true;
      try {
        await this.confirmationHandlerFunction();
        this.isLoading = false;
        this.switcher.goById(this.successWindowSwitcherId);
      } catch (e) {
        this.switcher.goById(this.errorWindowSwitcherId);
      }
    } else {
      this.modalWindowService.close();
    }
    this.confirmClick.emit();
  }

  async dismiss(): Promise<void> {
    if (this.switcher) {
      if (this.dismissHandlerFunction) {
        await this.dismissHandlerFunction();
        return;
      } else if (this.switcher.previousIndex) {
        this.switcher.goBack();
        return;
      }
    }
    this.dismissClick.emit();
    this.modalWindowService.close();
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();

    this.confirmTranslationKey = this.confirmTranslationKey
      ? this.confirmTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.confirmTranslationKey];
    this.dismissTranslationKey = this.dismissTranslationKey
      ? this.dismissTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.dismissTranslationKey];
    this.questionTranslationKey = this.questionTranslationKey
      ? this.questionTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.questionTranslationKey];
    this.questionTranslationParams = this.questionTranslationParams
      ? this.questionTranslationParams
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.questionTranslationParams];
    this.aftermathTranslationKey = this.aftermathTranslationKey
      ? this.aftermathTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationKey];
    this.aftermathTemplate = this.aftermathTemplate
      ? this.aftermathTemplate
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.aftermathTemplate] as any);
    this.icon = this.icon ? this.icon : this.contextData[ConfirmationModalWindowSharedContextInputKeys.icon];
    this.confirmationHandlerFunction = this.confirmationHandlerFunction
      ? this.confirmationHandlerFunction
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.confirmationHandlerFunction] as any);
    this.dismissHandlerFunction = this.dismissHandlerFunction
      ? this.dismissHandlerFunction
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.dismissHandlerFunction] as any);
    this.successWindowSwitcherId = this.successWindowSwitcherId
      ? this.successWindowSwitcherId
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.successWindowSwitcherId];
    this.errorWindowSwitcherId = this.errorWindowSwitcherId
      ? this.errorWindowSwitcherId
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.errorWindowSwitcherId];
  }
}
