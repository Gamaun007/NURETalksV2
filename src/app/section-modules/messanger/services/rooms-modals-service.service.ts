import { MessagerRouterParams } from './../models/router-params.constant';
import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import {
  StatusModalWindowInputKeys,
  StatusModalWindowSharedContext,
  StatusType,
  StatusWindowModalComponent,
  ConfirmationModalWindowComponent,
  ModalWindowService,
} from 'core/modules/modals';

import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/modules/modals/models';
import { ConfirmationModalWindowInputKeys } from 'core/modules/modals';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoomsModalsServiceService {
  constructor(
    private modalSerivce: ModalWindowService,
    private router: Router,
    private userFacade: UserFacadeService
  ) {}

  openJoinRoomModal(room_id: string, room_name: string): void {
    const rootConfirmationTranslationKey = 'roomItem.modals.joinRoom';
    const modalWindowSwitcher: ModalWindowWithSwitcher<StatusModalWindowSharedContext> = {
      componentsToSwitch: [
        {
          id: 'open-join-user-to-room-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.aftermathTemplate]: null,
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: `${rootConfirmationTranslationKey}.join`,
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => this.confirmRoomJoining(room_id),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: `${rootConfirmationTranslationKey}.cancel`,
            [ConfirmationModalWindowInputKeys.icon]: 'info',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: `${rootConfirmationTranslationKey}.question`,
            [ConfirmationModalWindowInputKeys.questionTranslationParams]: { room_name },
            [ConfirmationModalWindowInputKeys.errorWindowSwitcherId]: 'room-join-error-modal',
            [ConfirmationModalWindowInputKeys.successWindowSwitcherId]: 'room-join-success-modal',
          },
        },
        {
          id: 'room-join-success-modal',
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.closeModalOnClick]: true,
          },
        },
        {
          id: 'room-join-error-modal',
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
      ],
      context: {
        translationKey: 'requirements.requirmentRemoval',
        [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: `${rootConfirmationTranslationKey}.aftermath`,
      },
    };

    this.modalSerivce.openInSwitcher(modalWindowSwitcher);
  }

  private async confirmRoomJoining(room_id: string): Promise<void> {
    try {
      await this.userFacade.joinUserToRoom(room_id);
      this.router.navigate([], {
        queryParams: {
          ...this.router.routerState.snapshot.root.queryParams,
          [MessagerRouterParams.roomId]: room_id,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
