import { UniversityStructureByIds } from './../../../university/models/university-structure.model';
import { createAction, props } from '@ngrx/store';
import { Message } from 'core/models/domain';

export const MessagesActionTypes = {
  LoadMessages: '[Messages] Load messages',

  MessagesLoaded: '[Messages] Messages loaded',

  SendMessage: '[Message] Send message',

  EditMessage: '[Message] Edit message',

  DeleteMessage: '[Message] Message deleted',

  GetLatestMessage: '[Message] Get latest message',
};

export const MessagesFirebaseActionTypes = {
  QueryMessagesChanges: '[Messages Firebase] Messages listener are set',
  MessagesAddedFirebaseAction: '[Messages Firebase] Messages added action from firebase handles',
  MessagesRemovedFirebaseAction: '[Messages Firebase] Messages removed action from firebase handles',
  MessagesModifiedFirebaseAction: '[Messages Firebase] Messages modified action from firebase handles',
};

export const MessagesActions = {
  loadMessages: createAction(MessagesActionTypes.LoadMessages, props<{ room_id: string }>()),
  getLatestMessage: createAction(MessagesActionTypes.LoadMessages, props<{ room_id: string, listenForFurtherNewMessages: boolean }>()),
  messagesLoaded: createAction(MessagesActionTypes.MessagesLoaded, props<{ room_id: string; payload: Message[] }>()),
  latestMessageGot: createAction(MessagesActionTypes.LoadMessages, props<{ message: Message }>()),
  deleteMessage: createAction(MessagesActionTypes.DeleteMessage, props<{ room_id: string; message_id: string }>()),
  editMessage: createAction(
    MessagesActionTypes.EditMessage,
    props<{ room_id: string; message_id: string; message_text: string }>()
  ),
  sendMessage: createAction(MessagesActionTypes.SendMessage, props<{ room_id: string; message_text: string, message_opertion_id: string }>()),
};

export const MessagesFirebaseActions = {
  queryMessagesChanges: createAction(MessagesFirebaseActionTypes.QueryMessagesChanges, props<{ room_id: string }>()),
  messagesAddedFirebaseAction: createAction(
    MessagesFirebaseActionTypes.MessagesAddedFirebaseAction,
    props<{ payload: Message }>()
  ),
  messagesRemovedFirebaseAction: createAction(
    MessagesFirebaseActionTypes.MessagesRemovedFirebaseAction,
    props<{ payload: Message }>()
  ),
  messagesModifiedFirebaseAction: createAction(
    MessagesFirebaseActionTypes.MessagesModifiedFirebaseAction,
    props<{ payload: Message }>()
  ),
};
