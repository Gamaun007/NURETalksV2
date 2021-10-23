import { RoomStateEntity } from './../../../store/reducers/rooms.reducer';
import {
  UniversityEntitiesName,
  UniversityStructureByIds,
} from './../../../../university/models/university-structure.model';
import { RoomsActions, RoomsFirebaseActions } from './../../../store/actions/rooms.actions';
import { RoomsState, roomsStateSelector } from './../../../store/state';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { Room } from 'core/models/domain/room.model';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class RoomsFacadeService {
  private allroomsCache$: Observable<RoomStateEntity[]>;
  constructor(private store: Store<RoomsState>, private actionDispatcher: ActionDispatcherService) {
    this.setAllRoomsCache();
    // THIS IS REQUIRED. Here we set global listener for rooms changes from firebase store
    this.store.dispatch(RoomsFirebaseActions.queryRoomsChanges());
  }

  async createGroupRoom(universityStructure: UniversityStructureByIds): Promise<any> {
    try {
      return await this.actionDispatcher.dispatchActionAsync(
        RoomsActions.createRoom({ universityStructure }),
        TrackOperations.CREATE_GROUP_ROOM,
        universityStructure[UniversityEntitiesName.group].toString()
      );
    } catch (e) {
      // Handle errors
    }
  }

  // To be done in the future if needed
  // getRoom(room_id: string, forceFetchRoom = false): Observable<Room> {
  //   return this.store.select(roomsStateSelector).pipe(
  //     switchMap((state) => {
  //       if (!state.isLoaded || forceFetchRoom) {
  //         this.store.dispatch(RoomsActions.loadSpecificRoom({ room_id }));
  //         return NEVER;
  //       }

  //       return this.store.select(roomsStateSelector).pipe(map((state) => state.entities[room_id].room));
  //     })
  //   );
  // }

  getAllRooms(reloadRooms = false): Observable<Room[]> {
    return this.allroomsCache$.pipe(map((entity) => entity.map((r) => r.room)));
  }

  private setAllRoomsCache(): void {
    this.allroomsCache$ = this.store.select(roomsStateSelector).pipe(
      switchMap((state) => {
        if (!state.isLoaded) {
          this.store.dispatch(RoomsActions.loadRooms());
          return NEVER;
        }

        return this.store.select(roomsStateSelector).pipe(map((state) => Object.values(state.entities)));
      })
    );
  }
}
