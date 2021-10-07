import { UserId } from './user.model';
import { RoomDetails } from './room-detail.model';

export interface RoomId {
  id?: string;
}
export interface Room extends RoomId {
  room_details: RoomDetails;
  //User ID's array
  users?: string[];
}
