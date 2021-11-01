export const NO_USERS_ERROR = (identifier: string) => `There is no user with identifier ${identifier} in the system!`;
export const MORE_THAN_ONE_USER_ERROR = (identifier: string) =>
  `There is more then 1 user with identifier ${identifier} in the system!`;
export const USER_ALREADY_EXISTS = (identifier: string) =>
  `There a user already exists with identifier ${identifier} in the system!`;
