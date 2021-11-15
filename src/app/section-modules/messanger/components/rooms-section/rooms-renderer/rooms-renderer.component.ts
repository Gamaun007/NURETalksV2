import { RoomsModalsServiceService } from './../../../services/rooms-modals-service.service';
import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
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
import { from, Observable } from 'rxjs';
import { createSortCallback, SubscriptionDetacher } from 'core/utils';
import { filter, map, switchMap, take } from 'rxjs/operators';

export const roomsBarSectionKey = 'tooms-bar-main-section';

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

  readonly roomsBarSectionKey = roomsBarSectionKey;
  allRooms$: Observable<Room[]>;

  @Input() parentScroller: PerfectScrollbarComponent;

  @Input() scopeKey?: string;

  buildItemsBinded = (items) => this.buildRenderingItems(items);

  constructor(
    private roomsFacade: RoomsFacadeService,
    private roomItemManagerService: RoomItemManagerService,
    private router: Router,
    private authService: AuthService,
    private userFacade: UserFacadeService,
    private roomsModalsService: RoomsModalsServiceService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
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
    this.allRooms$ = this.roomsFacade.getAllRooms();
    this.currentUser = await this.authService.getCurrentUserAsync();
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    let roomIdFromParams: string;
    this.router.routerState.root.queryParams
      .pipe(
        filter((params) => !!params[MessagerRouterParams.roomId]),
        switchMap((params) => {
          roomIdFromParams = params[MessagerRouterParams.roomId];
          return this.allRooms$.pipe(
            map((rooms) => rooms.find((r) => r.id === roomIdFromParams)),
            switchMap((room) => {
              return from(this.checkIfUserGroupMember(room));
            })
          );
        }),
        filter((r) => r)
      )
      .subscribe((isRoomMember) => {
        console.log('checkIfUserGroupMember, ', isRoomMember, roomIdFromParams);
        this.roomItemManagerService.selectRequest(roomIdFromParams, this.roomsBarSectionKey);
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

  private async checkIfUserGroupMember(room: Room): Promise<boolean> {
    const user = await this.authService.getCurrentUserAsync();
    if (await this.userFacade.isUserRoomMember(user.uid, room.id)) {
      return true;
    }

    this.roomsModalsService.openJoinRoomModal(room.id, room.room_details.name);
    return false;
  }

  async specificRoomClicked(room: Room): Promise<void> {
    if (await this.checkIfUserGroupMember(room)) {
      this.router.navigate([], {
        queryParams: {
          ...this.router.routerState.snapshot.root.queryParams,
          [MessagerRouterParams.roomId]: room.id,
        },
      });
    }
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
