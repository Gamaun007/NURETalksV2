import { NO_USERS_ERROR } from './../../http/errors.constants';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import {
  LoadSpecificUserAction,
  CreateUserAction,
  UploadUserProfileIconAction,
} from './../../../store/actions/user.actions';
import { Injectable } from '@angular/core';
import { User } from 'core/models/domain';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState, userStateSelector } from '../../../store/state';
import { map, switchMap, shareReplay } from 'rxjs/operators';

@Injectable()
export class UserFacadeService {
  constructor(private store: Store<AuthState>, private actionDispatcher: ActionDispatcherService) {}

  async loadSpecificUser(email: string): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        new LoadSpecificUserAction(email),
        TrackOperations.LOAD_SPECIFIC_USER,
        email
      );
    } catch (error) {
      if (error.message === NO_USERS_ERROR(email)) {
        this.createUser(email);
      }
    }
  }

  async uploadUserProfileIcon(user_id: string, file: File): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        new UploadUserProfileIconAction(user_id, file),
        TrackOperations.LOAD_SPECIFIC_USER,
        user_id
      );
    } catch (error) {
      // TODO
    }
  }

  async createUser(email: string): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(new CreateUserAction(email), TrackOperations.CREATE_USER);
    } catch (error) {}
  }

  getUser(email: string): Observable<User> {
    const specificUser$ = this.store.select(userStateSelector).pipe(map((state) => state.entities[email]));

    return specificUser$.pipe(
      switchMap((user) => {
        if (!user) {
          this.loadSpecificUser(email);
          return NEVER;
        } else {
          return specificUser$;
        }
      }),
      shareReplay()
    );
  }
}
