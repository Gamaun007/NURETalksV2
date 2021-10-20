import * as t from './reducers';
import { ActionReducerMap, combineReducers, compose, createFeatureSelector, createSelector } from '@ngrx/store';

export const featureKey = 'messagesState';

export interface MessagesState {
  messagesState: t.MessagesState;
}

export const reducers: ActionReducerMap<MessagesState> = {
  messagesState: t.messagesReducer,
};

export const messagesStateFeatureSelector = createFeatureSelector<MessagesState>(featureKey);

export const messagesStateSelector = createSelector(messagesStateFeatureSelector, (state) => state.messagesState);

// tslint:disable-next-line:typedef
export function store(state: any, action: any) {
  // tslint:disable-next-line:no-shadowed-variable
  const store = compose(combineReducers)(reducers);
  return store(state, action);
}
