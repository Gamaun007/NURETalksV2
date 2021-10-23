import { UserLoadBy } from './../../services/facades/user-facade/user-facade.service';
import { RoleEnum } from 'core/models/domain/roles.model';
import { UniversityStructureByIds } from './../../../university/models/university-structure.model';
import { Action, createAction, props } from '@ngrx/store';
import { User } from 'core/models/domain';

export const UserActionType = {
  LoadUsers: '[Users] Load users',

  CreateUser: '[User] Create user',

  UserCreated: '[User] User successfully created',

  UsersLoaded: '[Users] Users loaded',

  LoadSpecificUser: '[Users] Load specific user',

  SpecificUserLoaded: '[Users] Specific User Loaded',

  UserUpdated: '[User] User updated',

  UploadUserProfileIcon: '[User] Upload user profile icon',

  ChangeUserUniversityStructure: '[User] Change user university structure ',

  ChangeUserRole: '[User] Change user role',
};

export class LoadUsersAction implements Action {
  readonly type = UserActionType.LoadUsers;

  constructor() {}
}

export class UserCreatedAction implements Action {
  readonly type = UserActionType.UserCreated;

  constructor(public payload: User) {}
}

export class CreateUserAction implements Action {
  readonly type = UserActionType.CreateUser;

  constructor(public email: string) {}
}

export class UsersLoadedAction implements Action {
  readonly type = UserActionType.UsersLoaded;

  constructor(public payload: User[]) {}
}

export class LoadSpecificUserAction implements Action {
  readonly type = UserActionType.LoadSpecificUser;

  constructor(public key: string, public loadBy: UserLoadBy) {}
}

export class UploadUserProfileIconAction implements Action {
  readonly type = UserActionType.UploadUserProfileIcon;

  constructor(public user_id: string, public file: File) {}
}

export class SpecificUserLoadedAction implements Action {
  readonly type = UserActionType.SpecificUserLoaded;

  constructor(public user: User) {}
}

export class UserUpdatedAction implements Action {
  readonly type = UserActionType.UserUpdated;
  constructor(public user_id: string, public user: Partial<User>) {}
}

// // Consider to remove this action as it handles inappropriate way
// export class SpecificUserUpdatedAction implements Action {
//   readonly type = UserActionType.UserUpdated;

//   constructor(public payload: { email: string; changes: User }) {}
// }

export const UsersAdapterActions = {
  specificUserLoaded: createAction(UserActionType.SpecificUserLoaded, props<{ user: User }>()),
  usersLoaded: createAction(UserActionType.UsersLoaded, props<{ payload: User[] }>()),
  userUpdated: createAction(UserActionType.UserUpdated, props<{ user_id: string; user: Partial<User> }>()),

  createUser: createAction(UserActionType.CreateUser, props<{ email: string }>()),
  userCreated: createAction(UserActionType.UserCreated, props<{ payload: User }>()),

  // Actions only
  changeUserUniversityStructure: createAction(
    UserActionType.ChangeUserUniversityStructure,
    props<{ user_id: string; universityStructure: UniversityStructureByIds }>()
  ),
  changeUserRole: createAction(UserActionType.ChangeUserRole, props<{ user_id: string; role: RoleEnum }>()),
};
