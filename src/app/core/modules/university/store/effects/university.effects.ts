import { UniversityHttpService } from './../../services/http/university/university.service';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
// import { State } from 'core/modules/data/store';
import { from, NEVER, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { User } from 'core/models/domain';
import { UniversityActionTypes } from '../actions';
import { AuthState } from 'core/modules/auth-core/store/state';
import { FileStorageService, USER_PROFILE_IMAGE_PATH } from 'core/modules/firebase';
import { UniversityActions } from '../actions';

@Injectable()
export class UniversityEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private operationsTrackerService: OperationsTrackerService,
    private universityHttpService: UniversityHttpService,
    private fileStorageService: FileStorageService,
    private authService: AuthService
  ) {}

  // @Effect()
  // loadFaculties$: Observable<Action> = this.actions$.pipe(
  //   ofType(UniversityActionTypes.LoadFaculties),
  //   mergeMap((action: loadFaculties) =>
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

  loadFaculties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UniversityActions.loadFaculties),
      mergeMap((_) => {
        debugger;
        return this.universityHttpService.getFaculties().pipe(
          map((faculties) => UniversityActions.facultiesLoaded({ faculties })),
          tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_FACULTIES)),
          catchError((err: Error) => {
            this.operationsTrackerService.trackError(TrackOperations.LOAD_FACULTIES, err);
            return NEVER;
          })
        );
      })
    )
  );

  // loadSpecificUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActionType.LoadSpecificUser),
  //     mergeMap((action: LoadSpecificUserAction) =>
  //       this.usersHttpService.getSpecificUser(action.email).pipe(
  //         tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.LOAD_SPECIFIC_USER, action.email)),
  //         map((response: User) => {
  //           return new SpecificUserLoadedAction(response);
  //         }),
  //         catchError((err: Error) => {
  //           this.operationsTrackerService.trackError(TrackOperations.LOAD_SPECIFIC_USER, err, action.email);
  //           return NEVER;
  //         })
  //       )
  //     )
  //   )
  // );

  // createUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActionType.CreateUser),
  //     mergeMap((action: CreateUserAction) => {
  //       return this.fileStorageService.getFileFromStorage(USER_PROFILE_IMAGE_PATH, 'default.jpg').pipe(
  //         switchMap((imageUrl) => {
  //           debugger;
  //           return this.usersHttpService.createNewUser(action.email, { photoUrl: imageUrl }).pipe(
  //             tap((user) => this.operationsTrackerService.trackSuccess(user.email, TrackOperations.CREATE_USER)),
  //             map((createdUser) => {
  //               return new UserCreatedAction(createdUser);
  //             }),
  //             catchError((err) => {
  //               this.operationsTrackerService.trackError(action.email, err, TrackOperations.CREATE_USER);
  //               return NEVER;
  //             })
  //           );
  //         })
  //       );
  //     })
  //   )
  // );

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
