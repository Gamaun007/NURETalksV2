import { Room } from 'core/models/domain';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomItemComponent implements OnInit {

  @Input()
  room: Room;

  constructor() { }

  ngOnInit(): void {
  }

}
