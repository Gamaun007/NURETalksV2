import { RoleEnum } from './../../../../../core/models/domain/roles.model';
import { User } from 'core/models/domain/user.model';
import { AuthService } from 'core/modules/auth-core/services';
import { MessagerRouterParams } from './../../../models/router-params.constant';
import { Router } from '@angular/router';
import { RoomItemManagerService } from 'core/modules/rooms/services/helpers';
import { RoomsFacadeService } from 'core/modules/rooms/services/facades/rooms-facade/rooms-facade.service';
import { Room } from 'core/models/domain/room.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, pipe } from 'rxjs';
import { createSortCallback, groupBy, SubscriptionDetacher } from 'core/utils';
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
  currentUser: User;

  readonly roomsBarSectionKey = 'tooms-bar-main-section';
  allRooms$: Observable<Room[]>;

  @Input() parentScroller: PerfectScrollbarComponent;

  @Input() scopeKey?: string;

  buildItemsBinded = (items) => this.buildRenderingItems(items);

  constructor(
    private roomsFacade: RoomsFacadeService,
    private roomItemManagerService: RoomItemManagerService,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.roomItemManagerService
      .listenRequestChangesByScope(this.roomsBarSectionKey)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((data) => {
        debugger;
        if (this.selectedRoomId) {
          this.roomItemManagerService.unselected(this.selectedRoomId, this.roomsBarSectionKey);
        }
        this.selectedRoomId = data.payload.room_id;
        this.roomItemManagerService.selected(this.selectedRoomId, this.roomsBarSectionKey);
        this.setQueryParam(this.selectedRoomId);
      });
    this.allRooms$ = this.roomsFacade.getAllRooms().pipe(map((rooms) => rooms.filter((r) => r.room_details)));
    this.currentUser = await this.authService.getCurrentUserAsync();
    this.cd.detectChanges();
    debugger;
  }

  ngAfterViewInit(): void {
    this.router.routerState.root.queryParams.subscribe((params) => {
      const roomIdFromParams = params[MessagerRouterParams.roomId];
      if (roomIdFromParams) {
        this.roomItemManagerService.selectRequest(roomIdFromParams, this.roomsBarSectionKey);
      }
    });
  }

  roomIdSelector(item: Room): string {
    return item?.id;
  }

  isRoomAvailable(room: Room): boolean {
    if (this.currentUser.role === RoleEnum.Admin || this.currentUser.role === RoleEnum.UniversityStaff) {
      return true;
    }

    if (room.users.includes(this.currentUser.uid)) {
      return true;
    }

    return false;
  }

  buildRenderingItems(items: Room[]): Room[] {
    if (!items) {
      return [];
    }

    return items.sort(
      createSortCallback((r) =>
        r.users.includes(this.currentUser.uid) ? `A${r.room_details.name}` : r.room_details.name
      )
    );
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
