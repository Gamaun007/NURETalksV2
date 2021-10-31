import { FileDownloadingHelperService } from 'core/services';
import { FileStorageService } from 'core/modules/firebase';
import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { Message, User, MessageWithAttachments, MessageType, MessageAttachment } from 'core/models/domain';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})
export class MessageItemComponent implements OnInit {
  private _isCurrentUserMessage$: Observable<boolean>;
  @Input()
  message: Message | MessageWithAttachments;

  get castedMessageWithAttachments(): MessageWithAttachments {
    return this.message as MessageWithAttachments;
  }

  user$: Observable<User>;

  @HostBinding('class.messgae-with-attachments')
  get isMessageWithAttachments(): boolean {
    return this.message.type === MessageType.ATTACHMENTS;
  }

  @HostBinding('class.current-user-message')
  get isCurrentUser(): Observable<boolean> {
    return this._isCurrentUserMessage$;
  }

  constructor(
    private userService: UserFacadeService,
    private fileStorageService: FileStorageService,
    private fileSaver: FileDownloadingHelperService
  ) {}

  ngOnInit(): void {
    (this.message as MessageWithAttachments).attachments;
    this.user$ = this.userService.getUserById(this.message.sender_id);
    this._isCurrentUserMessage$ = this.user$.pipe(map((user) => user.uid === this.message.sender_id));
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
