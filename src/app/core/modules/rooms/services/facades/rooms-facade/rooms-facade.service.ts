import { RoomsActions, RoomsFirebaseActions } from './../../../store/actions/rooms.actions';
import { RoomsState } from './../../../store/state';
import { ActionDispatcherService } from 'core/modules/data/services';
import { Room } from 'core/models/domain/room.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class RoomsFacadeService {
  constructor(private store: Store<RoomsState>, private actionDispatcher: ActionDispatcherService) {
    // THIS IS REQUIRED. Here we set global listener for rooms changes from firebase store
    this.store.dispatch(RoomsFirebaseActions.queryRoomsChanges());
  }

  createRoom(): void {}

  getRoom(roomId: string): Observable<Room> {
    return;
  }
}
