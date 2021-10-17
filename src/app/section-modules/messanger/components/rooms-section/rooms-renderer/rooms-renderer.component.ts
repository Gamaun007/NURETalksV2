import { RoomsFacadeService } from 'core/modules/rooms/services/facades/rooms-facade/rooms-facade.service';
import { Room } from 'core/models/domain/room.model';
import { Component, Input, OnInit } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { groupBy, SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-rooms-renderer',
  templateUrl: './rooms-renderer.component.html',
  styleUrls: ['./rooms-renderer.component.scss'],
})
export class RoomsRendererComponent implements OnInit {
  allRooms$: Observable<Room[]>;

  @Input() parentScroller: PerfectScrollbarComponent;

  constructor(private roomsFacade: RoomsFacadeService) {}

  ngOnInit(): void {
    this.allRooms$ = this.roomsFacade.getAllRooms();
  }

  roomIdSelector(item: Room): string {
    return item.id;
  }

  buildRenderingItems(items: Room[]): Room[] {
    if (!items) {
      return [];
    }

    // roomDetails is temptorary has to be changed to room_details
    return groupBy(items, (x) => x['roomDetails'].name).reduce((prev, curr) => [...prev, curr.key, ...curr.values], []);
  }
}
