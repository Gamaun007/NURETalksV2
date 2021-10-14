import { RoomsFirebaseActions } from './../actions/rooms.actions';
import { DocumentChangeType } from '@angular/fire/firestore';
import { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import { Room } from 'core/models/domain';

export function FirebaseRoomsActionsToNgrx(firestoreAction: DocumentChangeType): ActionCreator<
  string,
  (props: { payload: Room }) => {
    payload: Room;
  } & TypedAction<string>
> {
  switch (firestoreAction) {
    case 'added': {
      return RoomsFirebaseActions.roomsAddedFirebaseAction;
    }
    case 'modified': {
      return RoomsFirebaseActions.roomsModifiedFirebaseAction;
    }
    case 'removed': {
      return RoomsFirebaseActions.roomsRemovedFirebaseAction;
    }
  }
}
