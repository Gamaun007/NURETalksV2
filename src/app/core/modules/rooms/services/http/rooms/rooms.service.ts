import { SPECIFIC_GOUP_ROOM_NOT_FOUND, SPECIFIC_ROOM_NOT_FOUND } from '../errors.constants';
import { AuthService } from 'core/modules/auth-core/services';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { Room } from 'core/models/domain';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { take, mergeMap, tap, catchError, switchMap } from 'rxjs/operators';

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
      .collection<Room>('rooms', (ref) => ref.where('room_details.group_id', '==', group_id))
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

  getSpecificRoomById(room_id: string): Observable<Room> {
    return this.getRoomsCollectionReference()
      .doc(room_id)
      .valueChanges()
      .pipe(
        take(1),
        tap((r) => {
          if (!r) {
            return throwError(new Error(SPECIFIC_ROOM_NOT_FOUND(r.id)));
          }
        })
      );
  }

  updateRoom(room_id: string, roomValuesToupdate: Partial<Room>): Observable<Room> {
    return from(this.getRoomsCollectionReference().doc(room_id).update(roomValuesToupdate)).pipe(
      switchMap(() => this.getSpecificRoomById(room_id))
    );
  }

  createRoom(createRoomEntity: CreateGroupRoomEntity): Observable<Room> {
    // Persist a document id
    return this.getSpecificGroupRoom(createRoomEntity.group_id).pipe(
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

          return from(this.getRoomsCollectionReference().doc(id).set(room)).pipe(
            switchMap((res) => {
              return this.getSpecificGroupRoom(createRoomEntity.group_id);
            })
          );
        }
      })
    );
  }

  private getRoomsCollectionReference(): AngularFirestoreCollection<Room> {
    return this.afs.collection<Room>('rooms');
  }
}
