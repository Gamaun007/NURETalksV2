import { Direction, Faculty, Group, Speciality } from './university';
import { Message } from './message.model';

export interface RoomDetails {
  room_image: string;
  admin_ids: string[];
  name: string;

  // direction: Direction;
  // faculty: Faculty;
  // group: Group;
  // recentMessage: Message;
  // speciality: Speciality;

  // Consider using entity id's
  direction_id: number;
  faculty_id: number;
  group_id: number;
  // recent_message_id: Message;
  speciality_id: string;
}
