import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { Room, User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take, switchMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core';

@Injectable({
  providedIn: 'root',
})
export class UniversityHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  private getRoomsCollectionReference(): AngularFirestoreCollection<Room> {
    return this.afs.collection<Room>('rooms');
  }
}
