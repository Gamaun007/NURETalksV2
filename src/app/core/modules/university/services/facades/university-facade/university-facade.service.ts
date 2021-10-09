import { map, switchMap } from 'rxjs/operators';
import { universityStateSelector } from './../../../store/state';
import { UniversityActions } from './../../../store/actions/university.actions';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { UniversityState } from './../../../store/reducers/university.reducer';
import { Room } from 'core/models/domain/room.model';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Faculty } from 'core/models/domain';

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

  getFaculties(): Observable<Faculty[]> {
    return this.store.select(universityStateSelector).pipe(
      switchMap((state) => {
        debugger;
        if (!state.isLoaded) {
          this.loadAllFaculties();
          return NEVER;
        }
        return this.store.select(universityStateSelector).pipe(map((state) => Object.values(state.entities)));
      })
    );
  }
}
