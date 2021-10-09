import { Department } from './department';
import { DirectionExtended } from './direction';

export interface Faculty {
  id: number;
  fullName: string;
  shortName: string;

  departments: Department[];
  directions: DirectionExtended[];
}

// export interface Faculty {
//   id: number;
//   fullName: string;
//   shortName: string;
// }

// export interface FacultyExtended extends Faculty {
//   departments: Department[];
//   directions: DirectionExtended[];
// }
