import { createAction, props } from '@ngrx/store';
import { Room } from 'core/models/domain';

export const RoomActionTypes = {
  LoadRooms: '[Rooms] Load rooms',

  RoomsLoaded: '[Rooms] Rooms loaded',

  LoadSpecificRoom: '[Rooms] Load specific room',

  SpecificRoomLoaded: '[Rooms] Specific room loaded',

  CreateRoom: '[Room] Create room',

  RoomCreated: '[Room] Room created',

  RoomUpdated: '[Room] Room updated'
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
