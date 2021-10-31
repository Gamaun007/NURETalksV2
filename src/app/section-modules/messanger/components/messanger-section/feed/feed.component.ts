import { MessagesFacadeService } from 'core/modules/messages/services/facades/messages-facade/messages-facade.service';
import { Room } from 'core/models/domain/room.model';
import { RoomsFacadeService } from 'core/modules/rooms/services';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MessagerRouterParams } from '../../../models';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FileFieldControl } from 'core/modules/form-controls';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  readonly messageField = new FormControl('');
  readonly fileField = new FileFieldControl({});
  sendingMessageLoader$ = new Subject<boolean>();

  room: Room;

  constructor(
    private router: Router,
    private roomFacade: RoomsFacadeService,
    private cd: ChangeDetectorRef,
    private messagesFacade: MessagesFacadeService,
    public datepipe: DatePipe
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
        this.room = undefined;
        this.cd.detectChanges();
        this.room = room;
        this.cd.detectChanges();
      });
  }

  viewSchedule(): void {
    const currTime = new Date(Date.now());

    const timeFrom = this.datepipe.transform(currTime, 'dd.MM.yyyy');
    const timeTo = this.datepipe.transform(currTime.setMonth(currTime.getMonth() + 8), 'dd.MM.yyyy');

    window.open(
      `https://cist.nure.ua/ias/app/tt/f?p=778:201:3750290334261274:::201:P201_FIRST_DATE,P201_LAST_DATE,P201_GROUP,P201_POTOK:${timeFrom},${timeTo},${this.room.room_details.group_id},0:`,
      '_blank'
    );
  }

  async sendMessage(): Promise<void> {
    this.sendingMessageLoader$.next(true);
    this.messageField.disable();
    this.fileField.disable();
    try {
      this.messagesFacade.sendMessage(this.messageField.value, this.room.id, this.fileField.value);
      this.messageField.reset();
    } finally {
      this.sendingMessageLoader$.next(false);

      this.fileField.reset();
      this.messageField.reset();

      this.messageField.enable();
      this.fileField.enable();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `feed.${relativeKey}`;
  }
}
