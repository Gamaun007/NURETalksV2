import { AuthService } from 'core/modules/auth-core/services';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { Message, MessageAttachment, MessageType, MessageWithAttachments } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QueryFn } from '@angular/fire/firestore';
import { take, switchMap, mergeMap, map } from 'rxjs/operators';
// import {UploadTaskSnapshot} from '@angular/fire/storage/interfaces';
import { FileStorageService, ROOM_ATTACHMENTS_PATH_FACTORY } from 'core/modules/firebase';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class MessagesHttpService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private fileStorageService: FileStorageService
  ) {}

  getRoomMessagesChangesListener(room_id: string): Observable<DocumentChangeAction<Message>[]> {
    return this.afs
      .collection<Message>(this.messagesCollectionPathFactory(room_id), (ref) =>
        ref.where('lastOperationTime', '>', new Date()).orderBy('lastOperationTime')
      )
      .stateChanges();
  }

  getPreviousMessages(room_id: string, message_id: string, messages_amount: number = 1): Observable<Message[]> {
    return this.getMessagesCollectionReference(room_id)
      .doc(message_id)
      .get()
      .pipe(
        take(1),
        switchMap((snapshot) => {
          return this.getMessagesByQuery(
            room_id,
            (col) => col.orderBy('time', 'desc').startAfter(snapshot).limit(messages_amount),
            false
          ).pipe(take(1));
        })
      );
  }

  getLatestMessagesListener(
    room_id: string,
    messages_amount: number,
    listenRealTimeChanges: boolean
  ): Observable<Message[]> {
    return this.getMessagesByQuery(
      room_id,
      (col) => col.orderBy('time', 'desc').limit(messages_amount),
      listenRealTimeChanges
    );
  }

  getAllRoomMessages(room_id: string): Observable<Message[]> {
    return this.getMessagesCollectionReference(room_id).valueChanges().pipe(take(1));
  }

  createRoomMessageWithAttachments(
    room_id: string,
    message_text: string,
    attachments: FileList
  ): Observable<MessageWithAttachments> {
    const attachmentsRequestArray: Observable<MessageAttachment>[] = [];
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments.item(i);
      const fileIdAgainstName = this.afs.createId();
      const fileFullPath = this.fileStorageService.createFileFullPath(
        ROOM_ATTACHMENTS_PATH_FACTORY(room_id),
        fileIdAgainstName
      );
      attachmentsRequestArray.push(
        this.fileStorageService
          .uploadFileToStorageByFullPath(fileFullPath, attachment, {
            contentType: attachment.type,
            customMetadata: { original_name: attachment.name },
          })
          .snapshotChanges()
          .pipe(
            take(1),
            map((_) => {
              return { file_path: fileFullPath, id: fileIdAgainstName, name: attachment.name };
            })
          )
      );
    }

    return combineLatest(attachmentsRequestArray).pipe(
      switchMap((attachmentsFiles) => {
        return this.authService.getCurrentUserObservable().pipe(
          take(1),
          switchMap((user) => {
            const id = this.afs.createId();
            const now = new Date() as any;
            const message: MessageWithAttachments = {
              id,
              room_id,
              text: message_text,
              sender_id: user.uid,
              attachments: attachmentsFiles,
              type: MessageType.ATTACHMENTS,
              time: now,
              lastOperationTime: now,
            };
            return from(this.getMessagesCollectionReference(room_id).doc(id).set(message)).pipe(
              switchMap(() => {
                return this.getMessagesByQuery(room_id, (col) => col.where('id', '==', id), false).pipe(
                  mergeMap((x) => x)
                );
              })
            );
          })
        ) as Observable<MessageWithAttachments>;
      })
    );
  }

  createRoomMessage(room_id: string, message_text: string): Observable<Message> {
    return this.authService.getCurrentUserObservable().pipe(
      take(1),
      switchMap((user) => {
        const now = new Date() as any;
        const id = this.afs.createId();
        const message: Message = {
          id,
          room_id,
          text: message_text,
          sender_id: user.uid,
          type: MessageType.REGULAR,
          time: now,
          lastOperationTime: now,
        };
        return from(this.getMessagesCollectionReference(room_id).doc(id).set(message)).pipe(
          switchMap(() => {
            return this.getMessagesByQuery(room_id, (col) => col.where('id', '==', id), false).pipe(mergeMap((x) => x));
          })
        );
      })
    );
  }

  private getMessagesByQuery(
    roomId: string,
    query: QueryFn<firebase.firestore.DocumentData>,
    listenRealTimeChanges?: boolean
  ): Observable<Message[]> {
    const stream = this.afs.collection<Message>(this.messagesCollectionPathFactory(roomId), query).valueChanges();

    if (!listenRealTimeChanges) {
      return stream.pipe(take(1));
    } else {
      return stream;
    }
  }

  private getMessagesCollectionReference(roomId: string): AngularFirestoreCollection<Message> {
    return this.afs.collection<Message>(this.messagesCollectionPathFactory(roomId));
  }

  private messagesCollectionPathFactory(roomId: string): string {
    return `rooms/${roomId}/messages`;
  }
}
