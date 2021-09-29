import { AuthRoutes } from 'core/constants/routes';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    // startsWith solves the bug with calling wrong authguard
    if (
      !this.router.routerState.snapshot.url.startsWith(`/${AppRoutes.Auth}`) &&
      !(await this.authService.isAuthenticatedAsync())
    ) {
      return this.router.createUrlTree([AppRoutes.Auth, AuthRoutes.SignIn]);
    }

    return true;
  }
}
