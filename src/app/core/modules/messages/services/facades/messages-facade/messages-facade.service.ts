import {
  UniversityEntitiesName,
  UniversityStructureByIds,
} from './../../../../university/models/university-structure.model';
import { MessagesState, messagesStateSelector } from './../../../store/state';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { Room } from 'core/models/domain/room.model';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesActions } from '../../../store';

@Injectable()
export class MessagesFacadeService {
  constructor(
    private store: Store<MessagesState>,
    private actionDispatcher: ActionDispatcherService,
    private afs: AngularFirestore
  ) {}

  async sendMessage(message_text: string, room_id: string): Promise<void> {
    // This is not the result id of the message, we will use this generated id to track as operation id
    const operationId = this.afs.createId();

    try {
      await this.actionDispatcher.dispatchActionAsync(
        MessagesActions.sendMessage({ room_id, message_text, message_opertion_id: operationId }),
        TrackOperations.CREATE_MESSAGE,
        operationId
      );
    } catch (e) {
      // TODO
    }
  }
}
