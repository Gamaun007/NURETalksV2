import { IDirection } from './university/direction';
import { IFaculty } from './university/faculty';
import { IGroup } from './university/group';
import { ISpeciality } from './university/speciality';

export interface IRoomDetails {
  roomId: string;
  roomImage: string;
  adminId: string;
  name: string;

  direction: IDirection;
  faculty: IFaculty;
  group: IGroup;
  recentMessage: IMessage;
  speciality: ISpeciality;
}
