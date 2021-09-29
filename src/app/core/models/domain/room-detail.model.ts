import { Direction, Faculty, Group, Speciality } from './university';
import { Message } from './message.model';

export interface RoomDetails {
  roomId: string;
  roomImage: string;
  adminId: string;
  name: string;

  direction: Direction;
  faculty: Faculty;
  group: Group;
  recentMessage: Message;
  speciality: Speciality;
}
