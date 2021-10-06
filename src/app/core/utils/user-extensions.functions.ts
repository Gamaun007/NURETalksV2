import { capitalize } from './string-capitalize.extention';
import { NUREUaDomain } from './../models/domain/nure.domain.constant';

export function getNameByNureEmail(email: string): { firstName: string; lastName: string } {
  debugger;
  const beforeDomainEmailPart = email.replace(NUREUaDomain, '');
  const resultValues = beforeDomainEmailPart.split('.', 2);
  return { firstName: capitalize(resultValues[0]), lastName: capitalize(resultValues[1]) };
}
