import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';

export const featureKey = 'universityState';

export interface UniversityState {
  universityState: t.UniversityState;
}

export const reducers: ActionReducerMap<UniversityState> = {
  universityState: t.universityReducer,
};

export const universityStateFeatureSelector = createFeatureSelector<UniversityState>(featureKey);

export const universityStateSelector = createSelector(universityStateFeatureSelector, (state) => state.universityState);

// tslint:disable-next-line:typedef
export function store(state: any, action: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
