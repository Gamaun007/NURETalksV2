import { NUREUaDomain } from './../models/domain/nure.domain.constant';

export function getNameByNureEmail(email: string): { firstName: string; lastName: string } {
  const beforeDomainEmailPart = email.replace(NUREUaDomain, '');
  const resultValues = beforeDomainEmailPart.split('.', 2);
  return { firstName: resultValues[0], lastName: resultValues[1] };
}
