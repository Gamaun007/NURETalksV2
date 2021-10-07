import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { RoomsActions } from '../actions';
import { Room } from 'core/models/domain';

export interface RoomsState extends EntityState<Room> {
  isLoaded: boolean;
}

function selectRoomId(room: Room): any {
  return room.id;
}

export const roomsAdapter: EntityAdapter<Room> = createEntityAdapter<Room>({
  selectId: selectRoomId,
});

const initialState: RoomsState = roomsAdapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(RoomsActions.roomsLoaded, (state: RoomsState, action ) =>
    roomsAdapter.upsertMany(action.payload, { ...state, isLoaded: true })
  ),
  on(RoomsActions.specificRoomLoaded, (state: RoomsState, action) => {
    return roomsAdapter.upsertOne(action.room, state);
  }),
  on(RoomsActions.roomCreated, (state: RoomsState, action) => {
    return roomsAdapter.addOne(action.room, state);
  }),
  on(RoomsActions.roomUpdated, (state: RoomsState, action) => {
    return roomsAdapter.addOne(action.room as Room, state);
  }),
);

export function roomsReducer(state = initialState, action: Action): RoomsState {
  return adapterReducer(state, action);
}
