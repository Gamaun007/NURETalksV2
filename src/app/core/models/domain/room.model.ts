import { UserId } from './user.model';
import { RoomDetails } from './room-detail.model';

// export interface RoomId {

// }
export interface Room {
  id: string;
  room_details: RoomDetails;
  //User ID's array
  users?: string[];
}
