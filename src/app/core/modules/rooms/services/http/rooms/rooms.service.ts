import { MORE_THAN_ONE_USER_ERROR, NO_USERS_ERROR } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/models/domain/roles.model';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { Room, User } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { map, take, switchMap, mergeMap } from 'rxjs/operators';
import { getNameByNureEmail } from 'core/utils/user-extensions.functions';

export interface CreateGroupRoomEntity {
  name: string;
  photo_url: string;
  direction_id: number;
  faculty_id: number;
  group_id: number;
  speciality_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsHttpService {
  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  getAllRoomsChangesListener(): Observable<DocumentChangeAction<Room>[]> {
    return this.getRoomsCollectionReference().stateChanges();
  }

  getAllRooms(): Observable<Room[]> {
    return this.getRoomsCollectionReference().valueChanges().pipe(take(1));
  }

  createRoom(createRoomEntity: CreateGroupRoomEntity): Observable<void> {
    // Persist a document id
    const id = this.afs.createId();

    const room: Room = {
      id,
      room_details: {
        room_image: createRoomEntity.photo_url,
        admin_ids: [],
        name: createRoomEntity.name,

        direction_id: createRoomEntity.direction_id,
        faculty_id: createRoomEntity.faculty_id,
        group_id: createRoomEntity.group_id,
        speciality_id: createRoomEntity.speciality_id ? createRoomEntity.speciality_id : null,
      },
      users: [],
    };

    return from(this.getRoomsCollectionReference().doc(id).set(room));
  }

  private getRoomsCollectionReference(): AngularFirestoreCollection<Room> {
    return this.afs.collection<Room>('rooms');
  }
}
