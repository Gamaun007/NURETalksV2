import { IGroup } from './university/group';
import { ISpeciality } from './university/speciality';
import { IFaculty } from './university/faculty';
import { IDirection } from './university/direction';
import { Upload } from './upload.model';
import { Roles } from './user.model';

export interface SignUpModel {
  email: string;
  password: string;
  role: Roles;
  firstName: string;
  lastName: string;
  personalPhoto: Upload;

  direction: IDirection;
  faculty: IFaculty;
  speciality?: ISpeciality;
  group: IGroup;
}
