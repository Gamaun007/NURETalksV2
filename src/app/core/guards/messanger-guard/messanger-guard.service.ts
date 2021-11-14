import { RoleEnum } from './../../models/domain/roles.model';
import { UserPermissions, UserRolePermissionsMapper } from './../../models/domain/permissions.constant';
import { RoomsFacadeService } from './../../modules/rooms/services/facades/rooms-facade/rooms-facade.service';
import { User } from './../../models/domain/user.model';
import { MessagerRouterParams } from './../../../section-modules/messanger/models/router-params.constant';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from 'core/modules/auth-core/services';
import { map, take } from 'rxjs/operators';

@Injectable()
export class MessangerGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private roomFacade: RoomsFacadeService) {}

  async canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const currUser = await this.authService.getCurrentUserAsync();

    if (activatedRoute.queryParams[MessagerRouterParams.roomId]) {
      const isAllowed = await this.isUserAllowdToAccessRoom(currUser, activatedRoute.queryParams[MessagerRouterParams.roomId]);

      return isAllowed;
    }

    return true;
  }

  async isUserAllowdToAccessRoom(user: User, room_id: string): Promise<boolean> {
    const room = await this.roomFacade.getAllRooms().pipe(take(1), map((rooms) => rooms.find((r) => r.id === room_id))).toPromise();

    if(!room) {
      return false;
    }
    const userPermissions = UserRolePermissionsMapper[user.role as RoleEnum];
    if(userPermissions.includes(UserPermissions.AllGroupRoomsAllowed)) {
      return true;
    }

    if(userPermissions.includes(UserPermissions.OnlyRelatedGroupRoomsAllowed)) {
      return room.users.includes(user.uid);
    }

    return false;
  }
}
