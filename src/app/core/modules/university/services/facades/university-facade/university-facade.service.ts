import { UniversityStructureByIds } from './../../../models/university-structure.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { universityStateSelector } from './../../../store/state';
import { UniversityActions } from './../../../store/actions/university.actions';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { UniversityState } from './../../../store/reducers/university.reducer';
import { Injectable } from '@angular/core';
import { NEVER, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { Faculty, Group } from 'core/models/domain';
import { getGroupFromUniversityStructure, universityStructureChecker } from 'core/modules/university/domain';

@Injectable()
export class UniversityFacadeService {
  constructor(private store: Store<UniversityState>, private actionDispatcher: ActionDispatcherService) {}

  async loadAllFaculties(): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        UniversityActions.loadFaculties(),
        TrackOperations.LOAD_FACULTIES
      );
    } catch (error) {
      // HANDLE critical error
    }
  }

  checkUniversityStructure(universityStructure: UniversityStructureByIds): Observable<void> {
    return this.getFaculties().pipe(
      tap((faculties) => {
        try {
          universityStructureChecker(universityStructure, faculties);
        } catch (e) {
          return throwError(e);
        }
      }),
      map((_) => {
        return;
      })
    );
  }

  getGroupByUniversityStructure(universityStructure: UniversityStructureByIds): Observable<Group> {
    return this.getFaculties().pipe(
      tap((faculties) => {
        try {
          universityStructureChecker(universityStructure, faculties);
        } catch (e) {
          return throwError(e);
        }
      }),
      map((faculties) => {
        return getGroupFromUniversityStructure(universityStructure, faculties);
      })
    );
  }

  getFaculties(): Observable<Faculty[]> {
    return this.store.select(universityStateSelector).pipe(
      switchMap((state) => {
        if (!state.isLoaded) {
          this.loadAllFaculties();
          return NEVER;
        }
        return this.store.select(universityStateSelector).pipe(map((state) => Object.values(state.entities)));
      })
    );
  }
}
