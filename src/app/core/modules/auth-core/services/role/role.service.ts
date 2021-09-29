import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
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

  private async buildCache(): Promise<void> {
    const user = await this.authService.getCurrentUserAsync();

    if (user) {
      this.roleCache = of(user).pipe(
        map((_user) => ({
          role: _user?.role || null,
        })),
        shareReplay()
      );
    }
  }
}
