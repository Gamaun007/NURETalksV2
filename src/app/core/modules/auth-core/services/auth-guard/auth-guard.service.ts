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
    if (!state.url.startsWith(`/${AppRoutes.Auth}`) && !(await this.authService.isAuthenticatedAsync())) {
      return this.router.createUrlTree([AppRoutes.Auth, AuthRoutes.SignIn]);
    }

    return true;
  }
}
