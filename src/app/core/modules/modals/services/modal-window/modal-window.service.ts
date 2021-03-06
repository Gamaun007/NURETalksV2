import { Injectable } from '@angular/core';
import { ModalWindow, ModalWindowWithSwitcher } from '../../models';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { ModalWindowMessageKeys } from './constants/modal-window-message-keys.constants';

@Injectable({
  providedIn: 'root',
})
export class ModalWindowService {
  constructor(private messageBus: MessageBusService) {}

  open(modal: ModalWindow): void {
    this.messageBus.sendMessage(ModalWindowMessageKeys.OpenSingleModal, modal);
  }

  openInSwitcher(modal: ModalWindowWithSwitcher): void {
    this.messageBus.sendMessage(ModalWindowMessageKeys.OpenModals, modal);
  }

  updateContext(data: Pick<ModalWindow, 'id' | 'context'>): void {
    this.messageBus.sendMessage(ModalWindowMessageKeys.UpdateModalContext, data);
  }

  updateOptions(data: Pick<ModalWindow, 'id' | 'options'>): void {
    this.messageBus.sendMessage(ModalWindowMessageKeys.UpdateModalOptions, data);
  }

  openSuccessAlert(messageTranslationKey: string): void {
    this.close();
    const modalWindow: ModalWindow = { template: null, context: { messageTranslationKey, type: 'success' } };
    this.messageBus.sendMessage(ModalWindowMessageKeys.OpenAlert, modalWindow);
  }

  close(): void {
    this.messageBus.sendMessage(ModalWindowMessageKeys.CloseModal, null);
  }
}
