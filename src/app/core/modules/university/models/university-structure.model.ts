import { Direction, Faculty, Group, Speciality } from 'core/models/domain';
import { DropdownControl } from 'core/modules/form-controls';

export interface DirectionAsSpeciality extends Speciality {
  direction_id: number;
}

export type UniversityStructureDynamicForm = {
  [UniversityEntitiesName.faculty]: DropdownControl;
  [UniversityEntitiesName.direction]: DropdownControl;
  [UniversityEntitiesName.speciality]: DropdownControl;
  [UniversityEntitiesName.group]: DropdownControl;
};

export type UniversityStructureDynamicFormValuesMap = {
  [UniversityEntitiesName.faculty]: Faculty;
  [UniversityEntitiesName.direction]: Direction;
  [UniversityEntitiesName.speciality]: DirectionAsSpeciality;
  [UniversityEntitiesName.group]: Group;
};

export interface UniversityStructureByIds {
  [UniversityEntitiesName.faculty]: number;
  [UniversityEntitiesName.direction]: number;
  [UniversityEntitiesName.speciality]?: string;
  [UniversityEntitiesName.group]: number;
}

export enum UniversityEntitiesName {
  faculty = 'faculty',
  direction = 'direction',
  speciality = 'speciality',
  group = 'group',
}
