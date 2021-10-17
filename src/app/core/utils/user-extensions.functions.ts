import { capitalize } from './string-capitalize.extention';
import { NUREUaDomain } from './../models/domain/nure.domain.constant';

export function getNameByNureEmail(email: string): { first_name: string; last_name: string } {
  const beforeDomainEmailPart = email.replace(NUREUaDomain, '');
  const resultValues = beforeDomainEmailPart.split('.', 2);
  return { first_name: capitalize(resultValues[0]), last_name: capitalize(resultValues[1]) };
}
