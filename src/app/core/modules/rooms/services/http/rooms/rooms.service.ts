import { SPECIFIC_GOUP_ROOM_NOT_FOUND } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { Room } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { map, take, mergeMap, tap, catchError } from 'rxjs/operators';

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

  getSpecificGroupRoom(group_id: number): Observable<Room> {
    return this.afs
      .collection<Room>('rooms', (ref) => ref.where('roomDetails.group_id', '==', group_id))
      .valueChanges()
      .pipe(
        take(1),
        mergeMap((rooms) => {
          if (!rooms?.length) {
            return throwError(new Error(SPECIFIC_GOUP_ROOM_NOT_FOUND(group_id)));
          }
          return rooms;
        })
      );
  }

  createRoom(createRoomEntity: CreateGroupRoomEntity): Observable<void> {
    // Persist a document id
    return this.getSpecificGroupRoom(createRoomEntity.group_id).pipe(
      map((_) => {}),
      catchError((err: Error) => {
        if (err.message === SPECIFIC_GOUP_ROOM_NOT_FOUND(createRoomEntity.group_id)) {
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
      })
    );
  }

  private getRoomsCollectionReference(): AngularFirestoreCollection<Room> {
    return this.afs.collection<Room>('rooms');
  }
}
