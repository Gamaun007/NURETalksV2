import { Direction } from './university/direction';
import { Faculty } from './university/faculty';
import { Group } from './university/group';
import { Speciality } from './university/speciality';

export interface IUserId {
  uid?: string;
}
export interface IUser extends IUserId {
  email?: string;
  role: string;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  password?: string;

  direction: Direction;
  faculty: Faculty;
  speciality?: Speciality;
  group?: Group;

  // room id's as array
  rooms: string[];
}
