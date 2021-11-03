import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { FileDownloadingHelperService } from 'core/services';
import { FileStorageService } from 'core/modules/firebase';
import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { Message, User, MessageWithAttachments, MessageType, MessageAttachment } from 'core/models/domain';
import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})
export class MessageItemComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private _isCurrentUserMessage: boolean;
  @Input()
  message: Message | MessageWithAttachments;

  get castedMessageWithAttachments(): MessageWithAttachments {
    return this.message as MessageWithAttachments;
  }

  user$: Observable<User>;

  @HostBinding('class.message-with-attachments')
  get isMessageWithAttachments(): boolean {
    return this.message.type === MessageType.ATTACHMENTS;
  }

  @HostBinding('class.current-user-message')
  get isCurrentUser(): boolean {
    return this._isCurrentUserMessage;
  }

  constructor(
    private userService: UserFacadeService,
    private fileStorageService: FileStorageService,
    private fileSaver: FileDownloadingHelperService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    (this.message as MessageWithAttachments).attachments;
    this.user$ = this.userService.getUserById(this.message.sender_id);
    this.authService.getCurrentUserObservable();
    this.user$
      .pipe(
        switchMap((senderUser) =>
          this.authService.getCurrentUserObservable().pipe(map((currUser) => senderUser.uid === currUser.uid))
        ),
        this.detacher.takeUntilDetach()
      )
      .subscribe((isCurrentUserMessage) => {
        this._isCurrentUserMessage = isCurrentUserMessage;
      });
  }

  async clickOnFile(attachment: MessageAttachment): Promise<void> {
    const linkToFile = await this.fileStorageService
      .getFileFromStorageByFullPath(attachment.file_path)
      .pipe(take(1))
      .toPromise();

    const blob = await this.fileStorageService.getFileByHttp(linkToFile).pipe(take(1)).toPromise();

    this.fileSaver.downloadBlob(blob, attachment.name);
  }
}
