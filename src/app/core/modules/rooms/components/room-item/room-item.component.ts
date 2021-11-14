import { Router } from '@angular/router';
import { SubscriptionDetacher } from 'core/utils';
import {
  RoomItemEventPayloadMapper,
  RoomItemManagerMessage,
  RoomItemManagerService,
  RoomManagerDefaultPayload,
} from './../../services/helpers';
import { Room } from 'core/models/domain';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomItemComponent implements OnInit, OnChanges, OnDestroy, OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  room: Room;

  @Input()
  relatedScopeKey?: string;

  @HostBinding('class.selected')
  selected: boolean;

  roomIcon: string;


  constructor(private roomItemManager: RoomItemManagerService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('room' in changes && this.room) {
      this.roomIcon = `url(${this.room.room_details.room_image})`;
    }
  }

  selectItem(): void {
    if (this.relatedScopeKey) {
      this.roomItemManager.selectRequest(this.room.id, this.relatedScopeKey);
    }
  }

  unselectItem(): void {
    if (this.relatedScopeKey) {
      this.roomItemManager.unselectRequest(this.room.id, this.relatedScopeKey);
    }
  }

  ngOnInit(): void {
    if (this.relatedScopeKey) {
      this.roomItemManager
        .listenResultChangesByRoomIdAndScope(this.room.id, this.relatedScopeKey)
        .pipe(this.detacher.takeUntilDetach())
        .subscribe((data) => {
          switch (data.payload.event) {
            case RoomItemManagerMessage.CHANGE_SELECTION: {
              
              this.selected = (
                data.payload as RoomManagerDefaultPayload<
                  RoomItemManagerMessage.CHANGE_SELECTION,
                  RoomItemEventPayloadMapper
                >
              ).payload;
            }
          }
          this.cd.markForCheck();
        });
    }
  }
}
