import { Group } from './group';
import { Speciality } from './speciality';

export interface Direction {
  id: number;
  fullName: string;
  shortName: string;
  groups: Group[];
  specialities: Speciality[];
}

// export interface DirectionExtended extends Direction {
//   groups: Group[];
//   specialities: SpecialityExtended[];
// }
