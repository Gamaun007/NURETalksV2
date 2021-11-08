import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { MessagesActions, MessagesFirebaseActions } from '../actions';
import { Message } from 'core/models/domain';

export interface MessagesState extends EntityState<Message> {}

function selectMessageId(message: Message): any {
  return message.id;
}

export function sortByDate(prev: Message, curr: Message): number {
  return prev.time.toDate().getTime() - curr.time.toDate().getTime();
}

export const messageAdapter: EntityAdapter<Message> = createEntityAdapter<Message>({
  selectId: selectMessageId,
  sortComparer: sortByDate,
});

const initialState: MessagesState = messageAdapter.getInitialState();

const adapterReducer = createReducer(
  initialState,

  on(MessagesActions.messagesLoaded, (state: MessagesState, action) =>
    messageAdapter.upsertMany(action.payload, { ...state })
  ),
  on(MessagesActions.latestMessagesGot, (state: MessagesState, action) => {
    return messageAdapter.upsertMany(action.messages, { ...state });
  }),

  // Firebase actions reducer handlers
  on(MessagesFirebaseActions.messagesAddedFirebaseAction, (state: MessagesState, action) => {
    return messageAdapter.addOne(action.payload, state);
  }),

  on(MessagesFirebaseActions.messagesModifiedFirebaseAction, (state: MessagesState, action) => {
    return messageAdapter.upsertOne(action.payload, state);
  }),

  on(MessagesFirebaseActions.messagesRemovedFirebaseAction, (state: MessagesState, action) => {
    return messageAdapter.removeOne(action.payload.id, state);
  })
);

export function messagesReducer(state = initialState, action: Action): MessagesState {
  return adapterReducer(state, action);
}
