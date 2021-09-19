import { IUserId } from './user.model';
import { IRoomDetails } from './room-detail.model';

export interface IRoomId {
  id?: string;
}
export interface IRoom extends IRoomId {
  roomDetails: IRoomDetails;
  //User ID's array
  users?: string[];
}
