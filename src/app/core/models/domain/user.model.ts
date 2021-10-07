import { Direction } from './university/direction';
import { Faculty } from './university/faculty';
import { Group } from './university/group';
import { Speciality } from './university/speciality';

export interface UserId {
  uid?: string;
}
export interface User extends UserId {
  email?: string;
  role: string;
  photo_url?: string;
  first_name?: string;
  last_name?: string;
  password?: string;

  direction?: Direction;
  faculty?: Faculty;
  speciality?: Speciality;
  group?: Group;

  // room id's as array
  rooms?: string[];
}
