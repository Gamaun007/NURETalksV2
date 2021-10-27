import { MessagesState, messagesStateSelector } from './../../../store/state';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesActions, MessagesFirebaseActions } from '../../../store';
import { Message } from 'core/models/domain';

@Injectable()
export class MessagesFacadeService {
  constructor(
    private store: Store<MessagesState>,
    private actionDispatcher: ActionDispatcherService,
    private afs: AngularFirestore
  ) {}

  async sendMessage(message_text: string, room_id: string, attachments?: FileList): Promise<Message> {
    // This is not the result id of the message, we will use this generated id to track as operation id
    const operationId = this.afs.createId();

    try {
      return await this.actionDispatcher.dispatchActionAsync(
        MessagesActions.sendMessage({ room_id, message_text, message_opertion_id: operationId, attachments: attachments }),

        operationId,
        TrackOperations.CREATE_MESSAGE
      );
    } catch (e) {
      // TODO
    }
  }

  getMessageById(id: string): Observable<Message> {
    return this.store
      .select(messagesStateSelector)
      .pipe(map((state) => Object.values(state.entities).find((m) => m.id === id)));
  }

  setListenerForRoomMessages(room_id: string): void {
    try {
      this.actionDispatcher.dispatchActionAsync(
        MessagesFirebaseActions.queryMessagesChanges({ room_id }),
        TrackOperations.QUERY_FOR_MESSAGES_FOR_ROOM,
        room_id
      );
    } catch (e) {
      // TODO
    }
  }

  getMessages(room_id: string): Observable<Message[]> {
    return this.store
      .select(messagesStateSelector)
      .pipe(map((state) => Object.values(state.entities).filter((m) => m.room_id === room_id)));
  }

  async getMessagesBeforeSpecific(
    room_id: string,
    point_message_id: string,
    messages_amount: number = 50
  ): Promise<Message> {
    try {
      return await this.actionDispatcher.dispatchActionAsync(
        MessagesActions.loadRoomMessagesBeforeSpecific({
          room_id,
          specific_message_id: point_message_id,
          messages_amount,
        }),
        TrackOperations.GET_MESSAGES_BEFORE_SPECIFIC,
        room_id
      );
    } catch (e) {
      // TODO
    }
  }

  async getLatestRoomMessages(room_id: string, messages_amount: number = 50): Promise<Message[]> {
    try {
      return await this.actionDispatcher.dispatchActionAsync(
        MessagesActions.loadLatestRoomMessages({ room_id, messages_amount }),
        TrackOperations.GET_LATEST_MESSAGES,
        room_id
      );
    } catch (e) {
      // TODO
    }
  }
}
