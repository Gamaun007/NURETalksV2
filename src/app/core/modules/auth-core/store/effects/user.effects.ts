import { UserHttpService } from '../../services/http/user/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
// import { State } from 'core/modules/data/store';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
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

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private operationsTrackerService: OperationsTrackerService,
    private usersHttpService: UserHttpService
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

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionType.CreateUser),
      mergeMap((action: CreateUserAction) => {
        return this.usersHttpService.createNewUser(action.email).pipe(
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

  // @Effect({ dispatch: false })
  // userUpdated$: Observable<Action> = this.actions$.pipe(
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
  // );
}
