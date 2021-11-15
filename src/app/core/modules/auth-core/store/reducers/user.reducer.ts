import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  SpecificUserLoadedAction,
  UserCreatedAction,
  UsersAdapterActions,
  UsersLoadedAction,
  UsersRoomsActions,
  UserUpdatedAction,
} from '../actions';
import { User } from 'core/models/domain';

export interface UsersState extends EntityState<User> {
  isLoaded: boolean;
}

function selectUserId(user: User): any {
  return user.email;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: selectUserId,
});

const initialState: UsersState = usersAdapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(UsersAdapterActions.usersLoaded, (state: UsersState, action: UsersLoadedAction) =>
    usersAdapter.upsertMany(action.payload, { ...state, isLoaded: true })
  ),
  on(UsersAdapterActions.userUpdated, (state: UsersState, action) => {
    return usersAdapter.upsertOne(action.user as User, state);
  }),
  on(UsersAdapterActions.specificUserLoaded, (state: UsersState, action: SpecificUserLoadedAction) => {
    return usersAdapter.upsertOne(action.user, state);
  }),
  on(UsersAdapterActions.userCreated, (state: UsersState, action: UserCreatedAction) => {
    return usersAdapter.addOne(action.payload, state);
  }),
  on(UsersRoomsActions.userJoinedRoomSuccessfully, (state: UsersState, action) => {
    const user = state.entities[action.user_id];
    if (user) {
      let updatedRoomsList = [] as string[];
      if(user.rooms) {
        const roomIdAlreadyIncluded = user.rooms.includes(action.room_id); 
        if(roomIdAlreadyIncluded) {
          return state;
        } else {
          updatedRoomsList = [...user.rooms, action.room_id];
        }
      } else {
        updatedRoomsList = [action.room_id];
      }


      
    return usersAdapter.updateOne({ id: action.user_id, changes: { rooms: updatedRoomsList} }, state);
    } 
    return state;
  })
);

export function usersReducer(state = initialState, action: Action): UsersState {
  return adapterReducer(state, action);
}
