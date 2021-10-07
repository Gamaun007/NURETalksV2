import { UniversityActions } from './../actions/university.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FacultyExtended } from 'core/models/domain';

export interface UniversityState extends EntityState<FacultyExtended> {
  isLoaded: boolean;
}

function selectFacultyId(faculty: FacultyExtended): any {
  return faculty.id;
}

export const facultyAdapter: EntityAdapter<FacultyExtended> = createEntityAdapter<FacultyExtended>({
  selectId: selectFacultyId,
});

const initialState: UniversityState = facultyAdapter.getInitialState({ isLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(UniversityActions.facultiesLoaded, (state: UniversityState, action) =>
    facultyAdapter.upsertMany(action.faculties, { ...state, isLoaded: true })
  )
);

export function roomsReducer(state = initialState, action: Action): UniversityState {
  return adapterReducer(state, action);
}
