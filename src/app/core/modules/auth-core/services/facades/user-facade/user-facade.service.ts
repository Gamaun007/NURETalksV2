import { Injectable } from '@angular/core';
import { User } from '../../../models/domain';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState, featureKey } from '../../../store/state';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class UserFacadeService {
  constructor(private store: Store<AuthState>) {}

  getUsers(): Observable<User[]> {
    return this.store
      .select((x) => x[featureKey].userState)
      .pipe(
        filter((x) => x.isLoaded),
        map((x) => Object.values(x.entities))
      );
  }
}
