import { MessagesFacadeService } from './../../../../../core/modules/messages/services/facades/messages-facade/messages-facade.service';
import { Room } from 'core/models/domain/room.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, User } from 'core/models/domain';
import { map } from 'rxjs/operators';

export interface MessageViewModel {
  message: Message,
  relatedUser: User
}

@Component({
  selector: 'app-messages-renderer',
  templateUrl: './messages-renderer.component.html',
  styleUrls: ['./messages-renderer.component.scss']
})
export class MessagesRendererComponent implements OnInit, OnChanges {
  @Input()
  room: Room;

  roomMessages$: Observable<MessageViewModel[]>
  messages$: Observable<Message[]>

  constructor(private messageFacade: MessagesFacadeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if('room' in changes) {
      this.messageFacade.getLatestRoomMessages(this.room.id),
      this.messageFacade.setListenerForRoomMessages(this.room.id),
      this.messages$ = this.messageFacade.getMessages(this.room.id);
    }
  }

  ngOnInit(): void {


  }

}
