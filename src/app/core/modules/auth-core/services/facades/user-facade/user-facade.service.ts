import { RoomsFacadeService } from 'core/modules/rooms/services/facades/rooms-facade/rooms-facade.service';
import { UniversityStructureByIds } from './../../../../university/models/university-structure.model';
import { RoleEnum } from 'core/models/domain/roles.model';
import { USER_ALREADY_EXISTS } from './../../http/errors.constants';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import {
  LoadSpecificUserAction,
  CreateUserAction,
  UploadUserProfileIconAction,
  UsersAdapterActions,
} from './../../../store/actions/user.actions';
import { Injectable } from '@angular/core';
import { User } from 'core/models/domain';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState, userStateSelector } from '../../../store/state';
import { map, switchMap, shareReplay, take } from 'rxjs/operators';

export enum UserLoadBy {
  Email,
  Id,
}

@Injectable()
export class UserFacadeService {
  constructor(
    private store: Store<AuthState>,
    private actionDispatcher: ActionDispatcherService,
    private roomFacade: RoomsFacadeService
  ) {}

  private async loadSpecificUser(key: string, loadBy: UserLoadBy): Promise<User> {
    try {
      return await this.actionDispatcher.dispatchActionAsync(
        new LoadSpecificUserAction(key, loadBy),
        TrackOperations.LOAD_SPECIFIC_USER,
        key
      );
    } catch (error) {}
  }

  async changeUserUniversityStructureAccessory(
    user_id: string,
    universityStructure: UniversityStructureByIds
  ): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        UsersAdapterActions.changeUserUniversityStructure({ user_id, universityStructure }),
        TrackOperations.CHANGE_USER_UNIVERSITY_STRUCTURE,
        user_id
      );
    } catch (error) {
      // TODO
    }
  }

  async isUserRoomMember(user_id: string, room_id: string): Promise<boolean> {
    const selectedRoom = await this.roomFacade
      .getAllRooms()
      .pipe(
        map((r) => r.find((r) => r.id === room_id)),
        take(1)
      )
      .toPromise();
    const user = await this.loadSpecificUser(user_id, UserLoadBy.Id);
    return selectedRoom?.users?.includes(user_id) && user?.rooms?.includes(room_id)
  }

  async joinUserToRoom(room_id: string): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        UsersAdapterActions.addCurrentUserToRoom({ room_id }),
        TrackOperations.JOIN_USER_TO_ROOM,
        room_id
      );
    } catch (error) {
      // TODO
    }
  }

  async changeUserRole(user_id: string, role: RoleEnum): Promise<void> {
    try {
      await this.actionDispatcher.dispatchActionAsync(
        UsersAdapterActions.changeUserRole({ user_id, role }),
        TrackOperations.CHANGE_USER_ROLE,
        user_id
      );
    } catch (error) {
      // TODO
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
      await this.actionDispatcher.dispatchActionAsync(new CreateUserAction(email), email, TrackOperations.CREATE_USER);
    } catch (error) {
      if (error.message === USER_ALREADY_EXISTS(email)) {
        return;
      }
    }
  }

  getUserById(id: string): Observable<User> {
    const specificUser$ = this.store
      .select(userStateSelector)
      .pipe(map((state) => Object.values(state.entities)?.find((u) => u.uid === id)));

    return specificUser$.pipe(
      switchMap((user) => {
        if (!user) {
          this.loadSpecificUser(id, UserLoadBy.Id);
          return NEVER;
        } else {
          return specificUser$;
        }
      }),
      shareReplay()
    );
  }

  getUser(email: string): Observable<User> {
    const specificUser$ = this.store.select(userStateSelector).pipe(map((state) => state.entities[email]));

    return specificUser$.pipe(
      switchMap((user) => {
        if (!user) {
          this.loadSpecificUser(email, UserLoadBy.Email);
          return NEVER;
        } else {
          return specificUser$;
        }
      }),
      shareReplay()
    );
  }
}
