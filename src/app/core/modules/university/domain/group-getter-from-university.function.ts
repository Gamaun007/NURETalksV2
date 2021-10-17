import { Faculty } from './../../../models/domain/university/faculty';
import { UniversityEntitiesName, UniversityStructureByIds } from './../models/university-structure.model';
import { Group } from './../../../models/domain/university/group';

export function getGroupFromUniversityStructure(
  universityStructure: UniversityStructureByIds,
  faculties: Faculty[]
): Group {
  const direction = faculties
    .find((f) => f.id === universityStructure[UniversityEntitiesName.faculty])
    ?.directions.find((d) => d.id === universityStructure[UniversityEntitiesName.direction]);

  if (universityStructure.speciality) {
    return direction.specialities
      .find((s) => s.fullName === universityStructure[UniversityEntitiesName.speciality])
      ?.groups.find((g) => g.id === universityStructure[UniversityEntitiesName.group]);
  } else {
    return direction.groups.find((g) => g.id === universityStructure[UniversityEntitiesName.group]);
  }
}
