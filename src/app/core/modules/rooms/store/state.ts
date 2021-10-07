import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';

export const featureKey = 'roomsState';

export interface RoomsState {
  roomsState: t.RoomsState;
}

export const reducers: ActionReducerMap<RoomsState> = {
  roomsState: t.roomsReducer,
};

export const roomsStateFeatureSelector = createFeatureSelector<RoomsState>(featureKey);

export const roomsStateSelector = createSelector(roomsStateFeatureSelector, (state) => state.roomsState);

// tslint:disable-next-line:typedef
export function store(state: any, action: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
