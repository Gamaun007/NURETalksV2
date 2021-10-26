import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { Message, User } from 'core/models/domain';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})
export class MessageItemComponent implements OnInit {
  private _isCurrentUserMessage$: Observable<boolean>;
  @Input()
  message: Message;

  user$: Observable<User>;

  @HostBinding('class.current-user-message')
  get isCurrentUser(): Observable<boolean> {
    return this._isCurrentUserMessage$;
  }

  constructor(private userService: UserFacadeService) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUserById(this.message.sender_id);
    this._isCurrentUserMessage$ = this.user$.pipe(map((user) => user.uid === this.message.sender_id));
  }
}
