import { MessagerRouterParams } from './../../../models/router-params.constant';
import { Router } from '@angular/router';
import { RoomItemManagerService } from 'core/modules/rooms/services/helpers';
import { RoomsFacadeService } from 'core/modules/rooms/services/facades/rooms-facade/rooms-facade.service';
import { Room } from 'core/models/domain/room.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, pipe } from 'rxjs';
import { groupBy, SubscriptionDetacher } from 'core/utils';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-rooms-renderer',
  templateUrl: './rooms-renderer.component.html',
  styleUrls: ['./rooms-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsRendererComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private selectedRoomId: string;

  readonly roomsBarSectionKey = 'tooms-bar-main-section';
  allRooms$: Observable<Room[]>;

  @Input() parentScroller: PerfectScrollbarComponent;

  @Input() scopeKey?: string;

  constructor(
    private roomsFacade: RoomsFacadeService,
    private roomItemManagerService: RoomItemManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomItemManagerService
      .listenRequestChangesByScope(this.roomsBarSectionKey)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((data) => {
        if (this.selectedRoomId) {
          this.roomItemManagerService.unselected(this.selectedRoomId, this.roomsBarSectionKey);
        }
        this.selectedRoomId = data.payload.room_id;
        this.roomItemManagerService.selected(this.selectedRoomId, this.roomsBarSectionKey);
        this.setQueryParam(this.selectedRoomId);
      });
    this.allRooms$ = this.roomsFacade.getAllRooms().pipe(map((rooms) => rooms.filter((r) => r.room_details)));
  }

  ngAfterViewInit(): void {
    const roomIdFromParams = this.router.routerState.root.snapshot.queryParams[MessagerRouterParams.roomId];
    if (roomIdFromParams) {
      this.roomItemManagerService.selectRequest(roomIdFromParams, this.roomsBarSectionKey);
    }
  }

  roomIdSelector(item: Room): string {
    return item?.id;
  }

  buildRenderingItems(items: Room[]): Room[] {
    if (!items) {
      return [];
    }

    return groupBy(items, (x) => x.room_details.name).map((obj) => {
      return obj.values[0];
    });
  }

  private setQueryParam(roomId: string): void {
    this.router.navigate([], {
      queryParams: {
        ...this.router.routerState.snapshot.root.queryParams,
        [MessagerRouterParams.roomId]: roomId,
      },
    });
  }
}
