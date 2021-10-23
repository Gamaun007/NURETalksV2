import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { Message, User } from 'core/models/domain';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input()
  message: Message;

  user$: Observable<User>;

  constructor(private userService: UserFacadeService) { }

  ngOnInit(): void {
    
    this.user$ = this.userService.getUserById(this.message.sender_id);
    this.message.sender_id
  }

}
