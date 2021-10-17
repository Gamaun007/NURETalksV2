import { UniversityEntitiesName, UniversityStructureByIds } from './../../../../university/models/university-structure.model';
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
  constructor(private store: Store<RoomsState>, private actionDispatcher: ActionDispatcherService) {
    // THIS IS REQUIRED. Here we set global listener for rooms changes from firebase store
    this.store.dispatch(RoomsFirebaseActions.queryRoomsChanges());
  }

  async createGroupRoom(universityStructure: UniversityStructureByIds): Promise<any> {
    try {
     return await this.actionDispatcher.dispatchActionAsync(RoomsActions.createRoom({ universityStructure }),
      TrackOperations.CREATE_GROUP_ROOM,
       universityStructure[UniversityEntitiesName.group].toString());
    } catch (e) {
      // Handle errors
    }

  }

  getRoom(roomId: string): Observable<Room> {
    return;
  }

  getAllRooms(reloadRooms = false): Observable<Room[]> {
    return this.store.select(roomsStateSelector).pipe(
      switchMap((state) => {
        if(!state.isLoaded || reloadRooms) {
          this.store.dispatch(RoomsActions.loadRooms());
          return NEVER;
        }

        return this.store.select(roomsStateSelector).pipe(map((state) => Object.values(state.entities)));
      })
    )
  }
}
