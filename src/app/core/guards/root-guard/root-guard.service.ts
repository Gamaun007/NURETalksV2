import { AuthRoutes } from 'core/constants/routes';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRoute,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AppRoutes } from 'core/constants';
import { AuthService } from 'core/modules/auth-core/services';

@Injectable()
export class RootGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    debugger;
    const currUser = await this.authService.getCurrentUserAsync();

    if (currUser?.is_approved_account === undefined && !state.url.startsWith(`/${AppRoutes.ContinueProfile}`)) {
      return this.router.createUrlTree([`/${AppRoutes.ContinueProfile}`]);
    }

    if (currUser.is_approved_account) {
      if (state.url.startsWith(`/${AppRoutes.ContinueProfile}`)) {
        this.router.navigate(['/']);
      }
    }

    return true;
  }
}
