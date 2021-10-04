import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  SpecificUserLoadedAction,
  UserCreatedAction,
  UsersAdapterActions,
  UsersLoadedAction,
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
  on(UsersAdapterActions.userUpdated, (state: UsersState, action: UserUpdatedAction) => {
    return usersAdapter.upsertOne(action.user as User, state);
  }),
  on(UsersAdapterActions.specificUserLoaded, (state: UsersState, action: SpecificUserLoadedAction) => {
    return usersAdapter.upsertOne(action.user, state);
  }),
  on(UsersAdapterActions.userCreated, (state: UsersState, action: UserCreatedAction) => {
    return usersAdapter.addOne(action.payload, state);
  }),
);

export function usersReducer(state = initialState, action: Action): UsersState {
  return adapterReducer(state, action);
}
