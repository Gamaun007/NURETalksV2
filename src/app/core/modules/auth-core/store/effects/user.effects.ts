import { RoomsFacadeService } from './../../../rooms/services/facades/rooms-facade/rooms-facade.service';
import { UniversityFacadeService } from './../../../university/services/facades/university-facade/university-facade.service';
import { AuthService } from './../../services/auth/auth.service';
import { UploadUserProfileIconAction, UsersAdapterActions } from './../actions/user.actions';
import { UserHttpService } from '../../services/http/user/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
// import { State } from 'core/modules/data/store';
import { from, NEVER, Observable } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap, take } from 'rxjs/operators';
import { RoleEnum, User } from 'core/models/domain';
import {
  CreateUserAction,
  LoadSpecificUserAction,
  SpecificUserLoadedAction,
  UserActionType,
  UserCreatedAction,
} from '../actions';
import { FileStorageService, USER_PROFILE_IMAGE_PATH } from 'core/modules/firebase';
import { UniversityEntitiesName } from 'core/modules/university/models';
import { UserLoadBy } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private operationsTrackerService: OperationsTrackerService,
    private usersHttpService: UserHttpService,
    private fileStorageService: FileStorageService,
    private authService: AuthService,
    private universityFacade: UniversityFacadeService,
    private roomFacade: RoomsFacadeService
  ) {}

  uploadUserProfileIcon = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.UploadUserProfileIcon),
      mergeMap((action: UploadUserProfileIconAction) =>
        this.authService.getCurrentUserObservable().pipe(
          take(1),
          switchMap((user) => {
            return this.fileStorageService
              .uploadFileToStorage(USER_PROFILE_IMAGE_PATH, user.uid, action.file)
              .snapshotChanges()
              .pipe(
                switchMap((snap) => from(snap.ref.getDownloadURL()) as Observable<string>),
                map((response) => {
                  const partialUser: Partial<User> = {
                    photo_url: response,
                  };
                  return partialUser;
                }),
                switchMap((pUser) => this.usersHttpService.updateUser(user.uid, pUser).pipe(map(() => pUser))),
                map((pUser) => UsersAdapterActions.userUpdated({ user: pUser, user_id: user.uid })),
                tap(() =>
                  this.operationsTrackerService.trackSuccess(TrackOperations.UPLOAD_USER_PROFILE_ICON, user.email)
                ),
                catchError((err: Error) => {
                  this.operationsTrackerService.trackError(TrackOperations.UPLOAD_USER_PROFILE_ICON, err, user.email);
                  return NEVER;
                })
              );
          })
        )
      )
    )
  );

  loadSpecificUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.LoadSpecificUser),
      mergeMap((action: LoadSpecificUserAction) => {
        const requestTo =
          action.loadBy === UserLoadBy.Id
            ? this.usersHttpService.getSpecificUserById(action.key)
            : this.usersHttpService.getSpecificUser(action.key);
        return requestTo.pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_SPECIFIC_USER, action.key)),
          map((response: User) => {
            return new SpecificUserLoadedAction(response);
          }),
          catchError((err: Error) => {
            this.operationsTrackerService.trackError(TrackOperations.LOAD_SPECIFIC_USER, err, action.key);
            return NEVER;
          })
        );
      })
    )
  );

  changeUserUniversityStructure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersAdapterActions.changeUserUniversityStructure),
      mergeMap((action) =>
        this.authService.getCurrentUserObservable().pipe(
          take(1),
          switchMap((user) => {
            return this.universityFacade.checkUniversityStructure(action.universityStructure).pipe(
              map((_) => {
                const parial: Partial<User> = {
                  faculty_id: action.universityStructure[UniversityEntitiesName.faculty],
                  direction_id: action.universityStructure[UniversityEntitiesName.direction],
                  // Set user account approval immediately to true, in the future the Admin role will manage user approval
                  is_approved_account: true,
                };

                if (action.universityStructure[UniversityEntitiesName.group]) {
                  parial.group_id = action.universityStructure[UniversityEntitiesName.group];
                }

                if (action.universityStructure[UniversityEntitiesName.speciality]) {
                  parial.speciality_id = action.universityStructure[UniversityEntitiesName.speciality];
                }

                return parial;
              }),
              switchMap((parialUser) => {
                const updateUserStructure$ = this.usersHttpService.updateUser(action.user_id, parialUser).pipe(
                  tap((_) =>
                    this.operationsTrackerService.trackSuccess(
                      TrackOperations.CHANGE_USER_UNIVERSITY_STRUCTURE,
                      action.user_id
                    )
                  ),
                  map((user) => UsersAdapterActions.userUpdated({ user_id: action.user_id, user }))
                );

                if (user.role === RoleEnum.Headman || user.role === RoleEnum.Student) {
                  return from(this.roomFacade.createGroupRoom(action.universityStructure)).pipe(
                    switchMap((_) => updateUserStructure$)
                  );
                }

                return updateUserStructure$;
              }),
              catchError((error) => {
                this.operationsTrackerService.trackError(
                  TrackOperations.CHANGE_USER_UNIVERSITY_STRUCTURE,
                  error,
                  action.user_id
                );
                return NEVER;
              })
            );
          })
          // getGroupByUniversityStructure is here because under the hood there is a structure checker!
        )
      )
    )
  );

  createUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersAdapterActions.changeUserRole),
      mergeMap((action) => {
        // Set user account approval immediately to true, in the future the Admin role will manage user approval
        return this.usersHttpService.updateUser(action.user_id, { role: action.role, is_approved_account: true }).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.CHANGE_USER_ROLE, action.user_id)),
          map((user) => UsersAdapterActions.userUpdated({ user_id: action.user_id, user })),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.CHANGE_USER_ROLE, error, action.user_id);
            return NEVER;
          })
        );
      })
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.CreateUser),
      mergeMap((action: CreateUserAction) => {
        return this.fileStorageService.getFileFromStorage(USER_PROFILE_IMAGE_PATH, 'default.jpg').pipe(
          switchMap((imageUrl) => {
            return this.usersHttpService.createNewUser(action.email, { photo_url: imageUrl }).pipe(
              tap((user) => this.operationsTrackerService.trackSuccess(user.email, TrackOperations.CREATE_USER)),
              map((createdUser) => {
                return new UserCreatedAction(createdUser);
              }),
              catchError((err) => {
                this.operationsTrackerService.trackError(action.email, err, TrackOperations.CREATE_USER);
                return NEVER;
              })
            );
          })
        );
      })
    )
  );

  // @Effect({ dispatch: false })
  // removeSpecificUser$: Observable<User> = this.actions$.pipe(
  //   ofType(UserActionType.RemoveUser),
  //   mergeMap((action: RemoveUserAction) => {
  //     return this.usersHttpService.removeSpecificUser(action.payload.email).pipe(
  //       tap(() => this.operationsTrackerService.trackSuccess(action.payload.email, TrackOperations.REMOVE_USER)),
  //       catchError((err) => {
  //         this.operationsTrackerService.trackError(action.payload.email, new Error(err), TrackOperations.REMOVE_USER);
  //         this.store.dispatch(new UserUpdatedAction(action.payload.user));
  //         return NEVER;
  //       })
  //     );
  //   })
  // );

  // @Effect({ dispatch: false })
  // resendUserInvitation$: Observable<Action> = this.actions$.pipe(
  //   ofType(UserActionType.ResendUserInvitation),
  //   mergeMap((action: ResendUserInvitationAction) => {
  //     return this.usersHttpService.updateUser(action.user_email).pipe(
  //       tap(() => this.operationsTrackerService.trackSuccess(action.user_email, TrackOperations.UPDATE_USER)),
  //       catchError((err) => {
  //         this.operationsTrackerService.trackError(action.user_email, new Error(err), TrackOperations.UPDATE_USER);
  //         return NEVER;
  //       })
  //     );
  //   })
  // );

  // userUpdated$ = createEffect(() => this.actions$.pipe(
  //   ofType(UserActionType.UserUpdated),
  //   mergeMap((action: UserUpdatedAction) => {
  //     return this.usersHttpService.updateUser(action.user.email).pipe(
  //       tap(() => this.operationsTrackerService.trackSuccess(action.user.email, TrackOperations.UPDATE_USER)),
  //       catchError((err) => {
  //         this.operationsTrackerService.trackError(action.user.email, new Error(err), TrackOperations.UPDATE_USER);
  //         return NEVER;
  //       })
  //     );
  //   })
  // ), { dispatch: false})
}
