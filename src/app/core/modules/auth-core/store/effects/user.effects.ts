// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Action, Store } from '@ngrx/store';
// import { UserStatus } from 'core/models/user-status';
// import { OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
// import { State } from 'core/modules/data/store';
// import { NEVER, Observable } from 'rxjs';
// import { catchError, map, mergeMap, tap } from 'rxjs/operators';
// import { User } from '../../models/domain/user';
// import {
//   CreateUserAction,
//   RemoveUserAction,
//   ResendUserInvitationAction,
//   UserActionType,
//   UserCreatedAction,
//   UsersLoadedAction,
//   UserUpdatedAction
// } from '../actions';

// @Injectable()
// export class UserEffects {
//   constructor(
//     private actions$: Actions,
//     private store: Store<State>,
//     private operationsTrackerService: OperationsTrackerService
//   ) {}

//   @Effect()
//   loadUsers$: Observable<Action> = this.actions$.pipe(
//     ofType(UserActionType.LoadUsers),
//     mergeMap(() => this.usersHttpService.getAllUsers().pipe(map((response) => new UsersLoadedAction(response))))
//   );

//   @Effect({ dispatch: false })
//   removeSpecificUser$: Observable<User> = this.actions$.pipe(
//     ofType(UserActionType.RemoveUser),
//     mergeMap((action: RemoveUserAction) => {
//       return this.usersHttpService.removeSpecificUser(action.payload.email).pipe(
//         tap(() => this.operationsTrackerService.trackSuccess(action.payload.email, TrackOperations.REMOVE_USER)),
//         catchError((err) => {
//           this.operationsTrackerService.trackError(action.payload.email, new Error(err), TrackOperations.REMOVE_USER);
//           this.store.dispatch(new UserUpdatedAction(action.payload.user));
//           return NEVER;
//         })
//       );
//     })
//   );

//   @Effect()
//   createUser$: Observable<Action> = this.actions$.pipe(
//     ofType(UserActionType.CreateUser),
//     mergeMap((action: CreateUserAction) => {
//       return this.usersHttpService.createNewUser(action.payload.user).pipe(
//         map((createdUser) => {
//           this.operationsTrackerService.trackSuccess('user', TrackOperations.CREATE_USER);

//           return new UserCreatedAction({
//             ...action.payload.user,
//             last_login: null,
//             status: UserStatus.PROVISIONED,
//           });
//         }),
//         catchError((err) => {
//           this.operationsTrackerService.trackError('user', err, TrackOperations.CREATE_USER);
//           return NEVER;
//         })
//       );
//     })
//   );

//   @Effect({ dispatch: false })
//   resendUserInvitation$: Observable<Action> = this.actions$.pipe(
//     ofType(UserActionType.ResendUserInvitation),
//     mergeMap((action: ResendUserInvitationAction) => {
//       return this.usersHttpService.updateUser(action.user_email).pipe(
//         tap(() => this.operationsTrackerService.trackSuccess(action.user_email, TrackOperations.UPDATE_USER)),
//         catchError((err) => {
//           this.operationsTrackerService.trackError(action.user_email, new Error(err), TrackOperations.UPDATE_USER);
//           return NEVER;
//         })
//       );
//     })
//   );

//   @Effect({ dispatch: false })
//   userUpdated$: Observable<Action> = this.actions$.pipe(
//     ofType(UserActionType.UserUpdated),
//     mergeMap((action: UserUpdatedAction) => {
//       return this.usersHttpService.updateUser(action.user.email).pipe(
//         tap(() => this.operationsTrackerService.trackSuccess(action.user.email, TrackOperations.UPDATE_USER)),
//         catchError((err) => {
//           this.operationsTrackerService.trackError(action.user.email, new Error(err), TrackOperations.UPDATE_USER);
//           return NEVER;
//         })
//       );
//     })
//   );
// }
