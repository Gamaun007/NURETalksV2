import { Direction, Faculty, Group, Speciality } from './university';
import { Message } from './message.model';

export interface RoomDetails {
  room_id: string;
  room_image: string;
  admin_ids: string[];
  name: string;

  // direction: Direction;
  // faculty: Faculty;
  // group: Group;
  // recentMessage: Message;
  // speciality: Speciality;

  // Consider using entity id's
  direction_id: string;
  faculty_id: string;
  group_id: string;
  recent_message_id: Message;
  speciality_id: string;
}
