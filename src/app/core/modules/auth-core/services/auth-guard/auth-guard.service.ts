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
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  async canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    // startsWith solves the bug with calling wrong authguard
    debugger;
    if (!state.url.startsWith(`/${AppRoutes.Auth}`) && !(await this.authService.isAuthenticatedAsync())) {
      return this.router.createUrlTree([AppRoutes.Auth, AuthRoutes.SignIn]);
    }

    // if (
    //   (await this.authService.getCurrentUserAsync())?.is_approved_account === undefined &&
    //   !this.router.routerState.snapshot.url.startsWith(`/${AppRoutes.ContinueProfile}`)
    // ) {
    //   //return this.router.createUrlTree([`/${AppRoutes.ContinueProfile}`, '']);
    //   await this.router.navigate([`/${AppRoutes.ContinueProfile}`]);
    //   debugger;
    //   return false;
    //   // return this.router.createUrlTree([{ segmentPath: `./${AppRoutes.ContinueProfile}` }], {
    //   //   relativeTo: this.activatedRoute,
    //   // });
    // }

    return true;
  }
}
