import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { VirtualScrollRendererComponent } from 'core/modules/rendering/components/virtual-scroll-renderer/virtual-scroll-renderer.component';
import { OperationsTrackerService } from 'core/modules/data/services/operations-tracker/operations-tracker.service';
import { MessagesFacadeService } from 'core/modules/messages/services/facades/messages-facade/messages-facade.service';
import { Room } from 'core/models/domain/room.model';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from 'core/models/domain';
import { switchMap, take } from 'rxjs/operators';
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

  tempCheckPointMessagePosition: Message;

  constructor(
    private messageFacade: MessagesFacadeService,
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
      .subscribe((_) => {
        this.tempCheckPointMessagePosition = null;
        this.parentScroller.directiveRef.scrollToBottom();
      });

    this.messageFacade.setListenerForRoomMessages(this.room.id);
    this.messages$ = this.messageFacade.getMessages(this.room.id);

    const messages = await this.messageFacade.getLatestRoomMessages(this.room.id, this.bufferMessagesCount);
    if (!messages?.length) {
      this.noMessagesState = true;
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.loading$.next(true);
  }

  closeLoader(): void {
    this.loading$.next(false);
    this.cd.detectChanges();
  }

  async fetchNextMessages(event: any): Promise<void> {
    const mess = await this.messages$.pipe(take(1)).toPromise();
    this.tempCheckPointMessagePosition = mess[0];

    this.messageFacade.getMessagesBeforeSpecific(this.room.id, this.tempCheckPointMessagePosition.id);
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
    this.virtualScroller.scrollInto(mess[mess.length - 1], 0);
    this.loading$.next(false);
  }
}
