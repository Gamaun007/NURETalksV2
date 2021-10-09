import { Department } from './department';
import { Direction } from './direction';

export interface Faculty {
  id: number;
  fullName: string;
  shortName: string;

  departments: Department[];
  directions: Direction[];
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
