import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const RESULT_EVENT = 'result_event';
export const REQUEST_EVENT = 'request_event';

export enum RoomItemManagerMessage {
  CHANGE_SELECTION = 'CHANGE_SELECTION',
  ANY = 'asas',
}

export type RoomItemEventPayloadMapper = {
  [RoomItemManagerMessage.CHANGE_SELECTION]: boolean;
};

export interface RoomManagerDefaultPayload<T extends RoomItemManagerMessage, K extends { [key: string]: unknown }> {
  room_id: string;
  payload: K[T];
  event: T;
}

@Injectable()
export class RoomItemManagerService {
  constructor(private messageBus: MessageBusService) {}

  selected(room_id: string, scope_key: string): void {
    const payload: RoomManagerDefaultPayload<RoomItemManagerMessage.CHANGE_SELECTION, RoomItemEventPayloadMapper> = {
      payload: true,
      room_id,
      event: RoomItemManagerMessage.CHANGE_SELECTION,
    };

    this.messageBus.sendAsyncMessage(
      room_id,
      payload,
      this.makePartitionKey(RESULT_EVENT,scope_key)
    );
  }

  unselected(room_id: string, scope_key: string): void {
    const payload: RoomManagerDefaultPayload<RoomItemManagerMessage.CHANGE_SELECTION, RoomItemEventPayloadMapper> = {
      payload: false,
      room_id,
      event: RoomItemManagerMessage.CHANGE_SELECTION,
    };

    this.messageBus.sendAsyncMessage(
      room_id,
      payload,
      this.makePartitionKey(RESULT_EVENT,scope_key)
    );
  }

  selectRequest(room_id: string, scope_key: string): void {
    const payload: RoomManagerDefaultPayload<RoomItemManagerMessage.CHANGE_SELECTION, RoomItemEventPayloadMapper> = {
      payload: true,
      room_id,
      event: RoomItemManagerMessage.CHANGE_SELECTION,
    };

    this.messageBus.sendAsyncMessage(room_id, payload, this.makePartitionKey(REQUEST_EVENT,scope_key));
  }

  unselectRequest(room_id: string, scope_key: string): void {
    const payload: RoomManagerDefaultPayload<RoomItemManagerMessage.CHANGE_SELECTION, RoomItemEventPayloadMapper> = {
      payload: false,
      room_id,
      event: RoomItemManagerMessage.CHANGE_SELECTION,
    };

    this.messageBus.sendAsyncMessage(room_id, payload, this.makePartitionKey(REQUEST_EVENT,scope_key));
  }

  listenResultChangesByRoomIdAndScope(room_id: string, scope_key: string) {
    return this.listenChangesByScope(this.makePartitionKey(RESULT_EVENT,scope_key)).pipe(filter((data) => data.payload.room_id === room_id));
  }

  listenRequestChangesByRoomIdAndScope(room_id: string, scope_key: string) {
    return this.listenChangesByScope(this.makePartitionKey(REQUEST_EVENT,scope_key)).pipe(filter((data) => data.payload.room_id === room_id));
  }

  listenChangesByRoomIdAndScope(room_id: string, scope_key: string) {
    return this.listenChangesByScope(scope_key).pipe(filter((data) => data.payload.room_id === room_id));
  }

  listenResultChangesByScope(scope_key: string): Observable<{
    key: string;
    payload: RoomManagerDefaultPayload<RoomItemManagerMessage, RoomItemEventPayloadMapper>;
  }> {
    return this.listenChangesByScope(this.makePartitionKey(RESULT_EVENT,scope_key));
  }

  listenRequestChangesByScope(scope_key: string): Observable<{
    key: string;
    payload: RoomManagerDefaultPayload<RoomItemManagerMessage, RoomItemEventPayloadMapper>;
  }> {
    return this.listenChangesByScope(this.makePartitionKey(REQUEST_EVENT,scope_key));
  }

  listenChangesByScope(scope_key: string): Observable<{
    key: string;
    payload: RoomManagerDefaultPayload<RoomItemManagerMessage, RoomItemEventPayloadMapper>;
  }> {
    return this.messageBus.getFeedByKeyPrefix(scope_key) as Observable<{
      key: string;
      payload: RoomManagerDefaultPayload<RoomItemManagerMessage, RoomItemEventPayloadMapper>;
    }>;
  }

  private makePartitionKey(room_id: string, scope_key: string): string {
    return `${scope_key}-${room_id}`;
  }
}
