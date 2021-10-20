import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { Message, Room, User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QueryFn } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class MessagesHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getRoomMessagesChangesListener(room_id: string): Observable<DocumentChangeAction<Message>[]> {
    return this.getMessagesCollectionReference(room_id).stateChanges();
  }

  getLatestMessageListener(room_id: string, listenRealTimeChanges: boolean): Observable<Message> {
    return this.getMessagesByQuery(room_id, (col) => col.orderBy('time', 'desc').limit(1), listenRealTimeChanges).pipe(map((messages) => messages[0]));
  }

  getAllRoomMessages(room_id: string): Observable<Message[]> {
    return this.getMessagesCollectionReference(room_id).valueChanges().pipe(take(1));
  }

  createRoomMessage(room_id: string, message_text: string): Observable<void> {
    return this.authService.getCurrentUserObservable().pipe(
      take(1),
      switchMap((user) => {
        const id = this.afs.createId();
        const message: Message = {
          id,
          room_id,
          text: message_text,
          sender_id: user.uid,
          time: new Date(),
        };
        return from(this.getMessagesCollectionReference(room_id).doc(id).set(message));
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
