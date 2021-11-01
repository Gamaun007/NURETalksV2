import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { IPageInfo } from 'ngx-virtual-scroller';
import { VirtualScrollRendererComponent } from 'core/modules/rendering/components/virtual-scroll-renderer/virtual-scroll-renderer.component';
import { OperationsTrackerService } from 'core/modules/data/services/operations-tracker/operations-tracker.service';
import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { MessagesFacadeService } from 'core/modules/messages/services/facades/messages-facade/messages-facade.service';
import { Room } from 'core/models/domain/room.model';
import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { Message, User } from 'core/models/domain';
import { map, tap, switchMap, take, filter } from 'rxjs/operators';
import { TrackOperations } from 'core/modules/data/services';

@Component({
  selector: 'app-messages-renderer',
  templateUrl: './messages-renderer.component.html',
  styleUrls: ['./messages-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesRendererComponent implements AfterViewInit, OnDestroy, OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  readonly bufferMessagesCount = 13;
  readonly loading$ = new Subject<boolean>();

  noMessagesState: boolean;

  @Input()
  room: Room;

  @ViewChild('parentScroller')
  parentScroller: PerfectScrollbarComponent;

  @ViewChild('scroller')
  virtualScroller: VirtualScrollRendererComponent;

  messages$: Observable<Message[]>;

  constructor(
    private messageFacade: MessagesFacadeService,
    private userFacade: UserFacadeService,
    private operationService: OperationsTrackerService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading$.next(true);

    this.operationService
      .getOperationDataFeed<Message>(TrackOperations.CREATE_MESSAGE)
      .pipe(
        this.detacher.takeUntilDetach(),
        switchMap((message) => this.messageFacade.getMessageById(message.id))
      )
      .subscribe((data) => {
        this.virtualScroller.scrollInto(data);
      });

    this.messageFacade.setListenerForRoomMessages(this.room.id);
    this.messages$ = this.messageFacade.getMessages(this.room.id);
    // .pipe(tap((m) => this.virtualScroller.scrollInto(m[m.length - 1])));

    const messages = await this.messageFacade.getLatestRoomMessages(this.room.id, this.bufferMessagesCount);
    if (!messages?.length) {
      this.noMessagesState = true;
    }
    // this.loading$.next(true);
    // this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.loading$.next(true);
    // 
    // this.scrollToBottom();
  }

  closeLoader(): void {
    this.loading$.next(false)
  }

  fetchNextMessages(event: IPageInfo) {

    if (event.startIndex === 0) {
      console.log(event);
      console.log('fetchNextMessages');
    }
  }

  buildRenderingItems(items: Message[]): Message[] {
    if (!items) {
      return [];
    }

    return items.sort((a, b) => a.time.toDate().getTime() - b.time.toDate().getTime());
  }

  messageIdSelector(item: Message): string {
    return item?.id;
  }

  async scrollToBottom(): Promise<void> {
    const mess = await this.messages$.pipe(take(1)).toPromise();
    this.virtualScroller.scrollInto(mess[mess.length - 1]);
    this.loading$.next(false);
    // setTimeout(async () => {

    //   // this.virtualScroller.scrollToPosition(
    //   //   this.parentScroller.directiveRef.elementRef.nativeElement.scrollHeight,
    //   //   0,
    //   //   () => {
    //   //     this.loading$.next(false);
    //   //     this.cd.detectChanges();
    //   //   }
    //   // );
    // }, 420);
  }
}
