import { MessagerRouterParams } from './../../../models/router-params.constant';
import { Router } from '@angular/router';
import { AuthService } from 'core/modules/auth-core/services';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'core/models/domain';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-messanger',
  templateUrl: './messanger.component.html',
  styleUrls: ['./messanger.component.scss'],
})
export class MessangerComponent implements AfterViewInit {
  user$: Observable<User>;

  roomIdFromParams$: Observable<string>;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.roomIdFromParams$ = this.router.routerState.root.queryParams.pipe(
      map((params) => {
        return params[MessagerRouterParams.roomId] as string;
      }),
      filter((roomId) => !!roomId)
    );
  }

  buildTranslationKey(key: string): string {
    return `messanger.${key}`;
  }
}
