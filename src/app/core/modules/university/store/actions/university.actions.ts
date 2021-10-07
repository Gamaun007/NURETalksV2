import { FacultyExtended } from 'core/models/domain/university/faculty';
import { createAction, props } from '@ngrx/store';

export const UniversityActionTypes = {
  LoadFaculties: '[University/Faculties] Load faculties',
  FacultiesLoaded: '[University/Faculties] Faculties loaded',
};

export const UniversityActions = {
  loadFacultirs: createAction(UniversityActionTypes.LoadFaculties),
  facultiesLoaded: createAction(UniversityActionTypes.FacultiesLoaded, props<{ faculties: FacultyExtended[] }>()),
};
