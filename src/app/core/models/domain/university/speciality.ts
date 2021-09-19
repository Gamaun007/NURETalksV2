import { Group } from './group';

export interface Speciality {
  fullName: string;
}

export interface SpecialityExtended extends Speciality {
  groups: Group[];
}
