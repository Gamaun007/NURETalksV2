import { url } from './url/url.validator';
import { matchingValidator } from './matching/matching.validator';
import { weakPasswordValidator } from './weak-password/weak-password.validator';

export const CustomValidators = {
  url,
  matchingValidator,
  weakPasswordValidator,
};
