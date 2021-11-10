import { RoleEnum } from './roles.model';
export const enum UserPermissions  {
  AllGroupRoomsAllowed = 'all-group-rooms-allowed',
  OnlyRelatedGroupRoomsAllowed = 'only-related-group-rooms-allowed',
  RelatedRoomsManagmentAllowed ='related-rooms-management-allowed'
};

export const UserRolePermissionsMapper = {
  [RoleEnum.Admin]: [UserPermissions.AllGroupRoomsAllowed, UserPermissions.RelatedRoomsManagmentAllowed],
  [RoleEnum.Headman]: [UserPermissions.OnlyRelatedGroupRoomsAllowed, UserPermissions.RelatedRoomsManagmentAllowed],
  [RoleEnum.Student]: [UserPermissions.OnlyRelatedGroupRoomsAllowed],
  [RoleEnum.UniversityStaff]: [UserPermissions.AllGroupRoomsAllowed, UserPermissions.RelatedRoomsManagmentAllowed],
};
