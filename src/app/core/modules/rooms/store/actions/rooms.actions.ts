import { createAction, props } from '@ngrx/store';
import { Room } from 'core/models/domain';

export const RoomActionTypes = {
  LoadRooms: '[Rooms] Load rooms',

  RoomsLoaded: '[Rooms] Rooms loaded',

  LoadSpecificRoom: '[Rooms] Load specific room',

  SpecificRoomLoaded: '[Rooms] Specific room loaded',

  CreateRoom: '[Room] Create room',

  RoomCreated: '[Room] Room created',

  RoomUpdated: '[Room] Room updated',
};

export const RoomsFirebaseActionTypes = {
  QueryRoomsChanges: '[Rooms Firebase] Rooms listener are set',
  RoomsAddedFirebaseAction: '[Rooms Firebase] Rooms added action from firebase handles',
  RoomsRemovedFirebaseAction: '[Rooms Firebase] Rooms removed action from firebase handles',
  RoomsModifiedFirebaseAction: '[Rooms Firebase] Rooms modified action from firebase handles',
};

export const RoomsActions = {
  loadRooms: createAction(RoomActionTypes.LoadRooms),
  roomsLoaded: createAction(RoomActionTypes.RoomsLoaded, props<{ payload: Room[] }>()),
  loadSpecificRoom: createAction(RoomActionTypes.LoadSpecificRoom, props<{ room_id: string }>()),
  specificRoomLoaded: createAction(RoomActionTypes.SpecificRoomLoaded, props<{ room: Room }>()),
  roomUpdated: createAction(RoomActionTypes.RoomUpdated, props<{ room: Partial<Room> }>()),
  createRoom: createAction(RoomActionTypes.CreateRoom, props<{ room: Room }>()),
  roomCreated: createAction(RoomActionTypes.RoomCreated, props<{ room: Room }>()),
};

export const RoomsFirebaseActions = {
  queryRoomsChanges: createAction(RoomsFirebaseActionTypes.QueryRoomsChanges),
  roomsAddedFirebaseAction: createAction(RoomsFirebaseActionTypes.RoomsAddedFirebaseAction, props<{ payload: Room }>()),
  roomsRemovedFirebaseAction: createAction(
    RoomsFirebaseActionTypes.RoomsRemovedFirebaseAction,
    props<{ payload: Room }>()
  ),
  roomsModifiedFirebaseAction: createAction(
    RoomsFirebaseActionTypes.RoomsModifiedFirebaseAction,
    props<{ payload: Room }>()
  ),
};
