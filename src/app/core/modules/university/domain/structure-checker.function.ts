import { Faculty } from './../../../models/domain/university/faculty';
import { UniversityEntitiesName, UniversityStructureByIds } from './../models/university-structure.model';
import {
  DIRECTION_NOT_FOUND,
  FACULTY_NOT_FOUND,
  GROUP_NOT_FOUND,
  SPECIALITY_NOT_FOUND,
} from '../models/errors.constants';

export function universityStructureChecker(universityStructure: UniversityStructureByIds, faculties: Faculty[]): void {
  const faculty_id_to_find = universityStructure[UniversityEntitiesName.faculty];
  const faculty = faculties.find((f) => f.id === faculty_id_to_find);

  if (!faculty) {
    throw new Error(FACULTY_NOT_FOUND(faculty_id_to_find));
  }

  const direction_id_to_find = universityStructure[UniversityEntitiesName.direction];
  const direction = faculty.directions.find((d) => d.id === direction_id_to_find);

  if (!direction) {
    throw new Error(DIRECTION_NOT_FOUND(direction_id_to_find));
  }

  const speciality_name_to_find = universityStructure[UniversityEntitiesName.speciality];
  const group_id_to_find = universityStructure[UniversityEntitiesName.group];

  // If there is no speciality provided that means that group was selected from direction but not from speciality, so we skip it.
  if (speciality_name_to_find) {
    const speciality = direction.specialities.find((s) => s.fullName === speciality_name_to_find);

    if (!speciality) {
      throw new Error(SPECIALITY_NOT_FOUND(speciality_name_to_find));
    }

    if (group_id_to_find) {
      const group_from_speciality = speciality.groups.find((g) => g.id === group_id_to_find);

      if (!group_from_speciality) {
        throw new Error(GROUP_NOT_FOUND(group_id_to_find));
      }
    }
  } else if (group_id_to_find) {
    const group_from_direction = direction.groups.find((g) => g.id === group_id_to_find);

    if (!group_from_direction) {
      throw new Error(GROUP_NOT_FOUND(group_id_to_find));
    }
  }
}
