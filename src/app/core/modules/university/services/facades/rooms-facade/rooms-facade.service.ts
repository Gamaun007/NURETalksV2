import { Room } from 'core/models/domain/room.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoomsFacadeService {

  constructor() { }

  createRoom(): void {

  }

  getRoom(roomId: string): Observable<Room> {
    return;
  }
}
