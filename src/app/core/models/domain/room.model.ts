import { UserId } from './user.model';
import { RoomDetails } from './room-detail.model';

export interface RoomId {
  id?: string;
}
export interface Room extends RoomId {
  roomDetails: RoomDetails;
  //User ID's array
  users?: string[];
}
