import {
  FACULTY_NOT_FOUND,
  DIRECTION_NOT_FOUND,
  GROUP_NOT_FOUND,
  SPECIALITY_NOT_FOUND,
} from './../../../university/models/errors.constants';
import { UniversityFacadeService } from './../../../university/services/facades/university-facade/university-facade.service';
import { AuthService } from './../../services/auth/auth.service';
import { UploadUserProfileIconAction, UsersAdapterActions } from './../actions/user.actions';
import { UserHttpService } from '../../services/http/user/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
// import { State } from 'core/modules/data/store';
import { from, NEVER, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { User } from 'core/models/domain';
import {
  CreateUserAction,
  LoadSpecificUserAction,
  SpecificUserLoadedAction,
  UserActionType,
  UserCreatedAction,
  UsersLoadedAction,
  UserUpdatedAction,
} from '../actions';
import { AuthState } from 'core/modules/auth-core/store/state';
import { FileStorageService, USER_PROFILE_IMAGE_PATH } from 'core/modules/firebase';
import { UniversityEntitiesName } from 'core/modules/university/models';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private operationsTrackerService: OperationsTrackerService,
    private usersHttpService: UserHttpService,
    private fileStorageService: FileStorageService,
    private authService: AuthService,
    private universityFacade: UniversityFacadeService
  ) {}

  // @Effect()
  // loadSpecificUser$: Observable<Action> = this.actions$.pipe(
  //   ofType(UserActionType.LoadSpecificUser),
  //   mergeMap((action: LoadSpecificUserAction) =>
  //     this.usersHttpService.getSpecificUser(action.email).pipe(
  //       tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_SPECIFIC_USER, action.email)),
  //       map((response) => {
  //         return new SpecificUserLoadedAction(response);
  //       }),
  //       catchError((err: Error) => {
  //         this.operationsTrackerService.trackError(TrackOperations.LOAD_SPECIFIC_USER, err, action.email);
  //         return NEVER;
  //       })
  //     )
  //   )
  // );

  uploadUserProfileIcon = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.UploadUserProfileIcon),
      mergeMap((action: UploadUserProfileIconAction) =>
        this.authService.getCurrentUserObservable().pipe(
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
      mergeMap((action: LoadSpecificUserAction) =>
        this.usersHttpService.getSpecificUser(action.email).pipe(
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_SPECIFIC_USER, action.email)),
          map((response: User) => {
            return new SpecificUserLoadedAction(response);
          }),
          catchError((err: Error) => {
            this.operationsTrackerService.trackError(TrackOperations.LOAD_SPECIFIC_USER, err, action.email);
            return NEVER;
          })
        )
      )
    )
  );

  changeUserUniversityStructure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersAdapterActions.changeUserUniversityStructure),
      mergeMap((action) =>
        this.universityFacade.getFaculties().pipe(
          tap((faculties) => {
            debugger;
            const faculty_id_to_find = action.universityStructure[UniversityEntitiesName.faculty];
            const faculty = faculties.find((f) => f.id === faculty_id_to_find);

            if (!faculty) {
              return throwError(FACULTY_NOT_FOUND(faculty_id_to_find));
            }

            const direction_id_to_find = action.universityStructure[UniversityEntitiesName.direction];
            const direction = faculty.directions.find((d) => d.id === direction_id_to_find);

            if (!direction) {
              return throwError(DIRECTION_NOT_FOUND(direction_id_to_find));
            }

            const speciality_name_to_find = action.universityStructure[UniversityEntitiesName.speciality];
            const group_id_to_find = action.universityStructure[UniversityEntitiesName.group];

            // If there is no speciality provided that means that group was selected from direction but not from speciality, so we skip it.
            if (speciality_name_to_find) {
              const speciality = direction.specialities.find((s) => s.fullName === speciality_name_to_find);

              if (!speciality) {
                return throwError(SPECIALITY_NOT_FOUND(speciality_name_to_find));
              }

              const group_from_speciality = speciality.groups.find((g) => g.id === group_id_to_find);

              if (!group_from_speciality) {
                return throwError(GROUP_NOT_FOUND(group_id_to_find));
              }
            } else {
              const group_from_direction = direction.groups.find((g) => g.id === group_id_to_find);

              if (!group_from_direction) {
                return throwError(GROUP_NOT_FOUND(group_id_to_find));
              }
            }
          }),
          map((_) => {
            const parial: Partial<User> = {
              faculty_id: action.universityStructure[UniversityEntitiesName.faculty],
              direction_id: action.universityStructure[UniversityEntitiesName.direction],
              group_id: action.universityStructure[UniversityEntitiesName.group],
              // Set user account approval immediately to true, in the future the Admin role will manage user approval
              is_approved_account: true,
            };

            if (action.universityStructure[UniversityEntitiesName.speciality]) {
              parial.speciality_id = action.universityStructure[UniversityEntitiesName.speciality];
            }

            return parial;
          }),
          switchMap((parialUser) => {
            return this.usersHttpService
              .updateUser(action.user_id, parialUser)
              .pipe(map((user) => UsersAdapterActions.userUpdated({ user_id: action.user_id, user })));
          })
        )
      )
    )
  );

  createUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersAdapterActions.changeUserRole),
      mergeMap((action) => {
        debugger;
        // Set user account approval immediately to true, in the future the Admin role will manage user approval
        return this.usersHttpService
          .updateUser(action.user_id, { role: action.role, is_approved_account: true, })
          .pipe(map((user) => UsersAdapterActions.userUpdated({ user_id: action.user_id, user })));
      })
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.CreateUser),
      mergeMap((action: CreateUserAction) => {
        return this.fileStorageService.getFileFromStorage(USER_PROFILE_IMAGE_PATH, 'default.jpg').pipe(
          switchMap((imageUrl) => {
            debugger;
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
