import { Group } from './group';
import { SpecialityExtended } from './speciality';

export interface Direction {
  id: number;
  fullName: string;
  shortName: string;
}

export interface DirectionExtended extends Direction {
  groups: Group[];
  specialities: SpecialityExtended[];
}
