import { UserFacadeService } from './../../modules/auth-core/services/facades/user-facade/user-facade.service';
import { AuthService } from './../../modules/auth-core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'core/models/domain';
import { map } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';

@Component({
  selector: 'app-user-menu-bar',
  templateUrl: './user-menu-bar.component.html',
  styleUrls: ['./user-menu-bar.component.scss'],
})
export class UserMenuBarComponent implements OnInit {
  curentUser$: Observable<User>;
  userProfileIconUrl$: Observable<string>;

  getNameByNureEmail = getNameByNureEmail;

  constructor(private authService: AuthService, private userFacade: UserFacadeService) {}

  ngOnInit(): void {
    this.curentUser$ = this.authService.getCurrentUserObservable();
    this.userProfileIconUrl$ = this.curentUser$.pipe(map((user) => `url(${user.photo_url})`));
  }

  logout(): void {
    this.authService.signOutAsync();
  }
}
