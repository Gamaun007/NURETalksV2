import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { Room, User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';

@Injectable({
  providedIn: 'root',
})
export class RoomsHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getAllRoomsChangesListener(): Observable<DocumentChangeAction<Room>[]> {
   return this.getRoomsCollectionReference().stateChanges();
  }

  private getRoomsCollectionReference(): AngularFirestoreCollection<Room> {
    return this.afs.collection<Room>('rooms');
  }
}
