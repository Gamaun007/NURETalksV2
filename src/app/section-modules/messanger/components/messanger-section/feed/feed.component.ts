import { MessagesFacadeService } from './../../../../../core/modules/messages/services/facades/messages-facade/messages-facade.service';
import { Room } from './../../../../../core/models/domain/room.model';
import { RoomsFacadeService } from 'core/modules/rooms/services';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MessagerRouterParams } from '../../../models';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  readonly messageField = new FormControl('');
  sendingMessageLoader$ = new Subject<boolean>();

  room: Room;

  constructor(
    private router: Router,
    private roomFacade: RoomsFacadeService,
    private cd: ChangeDetectorRef,
    private messagesFacade: MessagesFacadeService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams
      .pipe(
        this.detacher.takeUntilDetach(),
        map((params) => params[MessagerRouterParams.roomId] as string),
        filter((roomId) => !!roomId),
        distinctUntilChanged((prev, curr) => prev === curr),
        switchMap((roomId) => {
          return this.roomFacade.getAllRooms().pipe(map((rooms) => rooms.find((r) => r.id === roomId)));
        }),
        distinctUntilChanged((prev, curr) => prev === curr)
      )
      .subscribe((room) => {
        this.room = room;
        this.cd.detectChanges();
      });
  }

  async sendMessage(): Promise<void> {
    this.sendingMessageLoader$.next(true);
    this.messageField.disable();
    try {
      await this.messagesFacade.sendMessage(this.messageField.value, this.room.id);
      this.messageField.reset();
    } finally {
      this.sendingMessageLoader$.next(false);
      this.messageField.enable();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `feed.${relativeKey}`;
  }
}
