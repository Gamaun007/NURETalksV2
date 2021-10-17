import { Room } from 'core/models/domain';
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomItemComponent implements OnInit, OnChanges {
  @Input()
  room: Room;

  roomIcon: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('room' in changes) {
      this.room = { ...this.room, room_details: this.room['roomDetails'] };
      this.room.room_details.room_image = this.room['roomImage'];
      this.roomIcon = `url(${this.room.room_details.room_image})`;
    }
  }

  ngOnInit(): void {}
}
