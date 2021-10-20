import { MessagesFirebaseActions } from './../actions/messages.actions';
import { DocumentChangeType } from '@angular/fire/firestore';
import { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import { Message } from 'core/models/domain';

export function FirebaseMessagesActionsToNgrx(firestoreAction: DocumentChangeType): ActionCreator<
  string,
  (props: { payload: Message }) => {
    payload: Message;
  } & TypedAction<string>
> {
  switch (firestoreAction) {
    case 'added': {
      return MessagesFirebaseActions.messagesAddedFirebaseAction;
    }
    case 'modified': {
      return MessagesFirebaseActions.messagesModifiedFirebaseAction;
    }
    case 'removed': {
      return MessagesFirebaseActions.messagesRemovedFirebaseAction;
    }
  }
}
