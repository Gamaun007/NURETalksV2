import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './reducers';

export const featureKey = 'authState';

export interface AuthState {
  userState: t.UsersState;
}

export const reducers: ActionReducerMap<AuthState> = {
  userState: t.usersReducer,
};

export const authStateFeatureSelector = createFeatureSelector<AuthState>(featureKey);

export const userStateSelector = createSelector(
  authStateFeatureSelector,
  (state) => state.userState
);

// tslint:disable-next-line:typedef
export function store(state: any, action: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
