import { Injectable } from '@angular/core';
import { RoleEnum, User } from '../../models/domain';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleCache: Observable<{ role: string }>;

  constructor(private authService: AuthService) {
    this.buildCache();
  }

  getCurrentUserRole(): Observable<{ role: string }> {
    return this.roleCache;
  }

  mapRole(role: string): RoleEnum {
    return (role.split(':')[1] as RoleEnum) || null;
  }

  private async buildCache(): Promise<void> {
    const user = await this.authService.getUserAsync();

    if (user) {
      this.roleCache = of(user).pipe(
        map((_user) => ({
          role: _user?.role.split(':')[1] || null,
        })),
        shareReplay()
      );
    }
  }
}
