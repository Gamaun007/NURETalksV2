import { UsersState } from './../../../auth-core/store/reducers/user.reducer';
import { UsersRoomsActions } from './../../../auth-core/store/actions/user.actions';
import { MessagesActions } from './../../../messages/store/actions/messages.actions';
import { RoomsFirebaseActions } from './../actions/rooms.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { RoomsActions } from '../actions';
import { Message, Room } from 'core/models/domain';

export interface RoomStateEntity {
  room: Room;
  latestRoomMessage?: Message;
}

export interface RoomsState extends EntityState<RoomStateEntity> {
  isLoaded: boolean;
}

function selectRoomId(roomEntity: RoomStateEntity): any {
  return roomEntity.room.id;
}

export const roomsAdapter: EntityAdapter<RoomStateEntity> = createEntityAdapter<RoomStateEntity>({
  selectId: selectRoomId,
});

const initialState: RoomsState = roomsAdapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(RoomsActions.roomsLoaded, (state: RoomsState, action) => {
    return roomsAdapter.upsertMany(mapRoomsToRoomStateEntities(action.payload), { ...state, isLoaded: true });
  }),
  on(RoomsActions.specificRoomLoaded, (state: RoomsState, action) => {
    return roomsAdapter.upsertOne(mapRoomToRoomStateEntity(action.room), state);
  }),
  on(RoomsActions.roomCreated, (state: RoomsState, action) => {
    return roomsAdapter.addOne(mapRoomToRoomStateEntity(action.room), state);
  }),
  on(RoomsActions.roomUpdated, (state: RoomsState, action) => {
    return roomsAdapter.addOne(mapRoomToRoomStateEntity(action.room as Room), state);
  }),

  // Mssages actions handling
  on(MessagesActions.latestMessagesGot, (state: RoomsState, action) => {
    if (action.messages?.length) {
      const latest = action.messages[action.messages.length - 1];
      const existingEntity = state.entities[latest.room_id];
      return roomsAdapter.upsertOne({ ...existingEntity, latestRoomMessage: latest }, state);
    }
    return state;
  }),

  // Firebase actions reducer handlers
  on(RoomsFirebaseActions.roomsAddedFirebaseAction, (state: RoomsState, action) => {
    return roomsAdapter.addOne(mapRoomToRoomStateEntity(action.payload), state);
  }),

  on(RoomsFirebaseActions.roomsModifiedFirebaseAction, (state: RoomsState, action) => {
    return roomsAdapter.upsertOne(mapRoomToRoomStateEntity(action.payload), state);
  }),

  on(RoomsFirebaseActions.roomsRemovedFirebaseAction, (state: RoomsState, action) => {
    return roomsAdapter.removeOne(action.payload.id, state);
  }),

  // Users Rooms related actions handling
  on(UsersRoomsActions.userJoinedRoomSuccessfully, (state, action) => {
    const room = state.entities[action.room_id];
    if (room?.room) {
      let updatedUsersList = [] as string[];
      if (room.room?.users) {
        const userIdAlreadyIncluded = room.room.users.includes(action.user_id);
        if (userIdAlreadyIncluded) {
          return state;
        } else {
          updatedUsersList = [...room.room.users, action.user_id];
        }
      } else {
        updatedUsersList = [action.user_id];
      }

      const updatedRoomObj: Room = { ...room.room, users: updatedUsersList };
      return roomsAdapter.updateOne({ id: action.room_id, changes: { room: updatedRoomObj } }, state);
    }
    return state;
  })
);

export function roomsReducer(state = initialState, action: Action): RoomsState {
  return adapterReducer(state, action);
}

export function mapRoomToRoomStateEntity(room: Room, message?: Message): RoomStateEntity {
  const res: RoomStateEntity = {
    room,
  };

  if (message) {
    res.latestRoomMessage = message;
  }

  return res;
}

export function mapRoomsToRoomStateEntities(rooms: Room[]): RoomStateEntity[] {
  const res: RoomStateEntity[] = [];

  rooms.forEach((element) => {
    res.push(mapRoomToRoomStateEntity(element));
  });

  return res;
}
