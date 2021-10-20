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
  on(MessagesActions.latestMessageGot, (state: RoomsState, action) => {
    const existingEntity = state.entities[action.message.room_id];
    return roomsAdapter.upsertOne({ ...existingEntity, latestRoomMessage: action.message }, state);
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
