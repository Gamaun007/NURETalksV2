import { url } from './url/url.validator';
import { matchingValidator } from './matching/matching.validator';
import { weakPasswordValidator } from './weak-password/weak-password.validator';
import { emailNureValidator} from './nure-email/nure-email.validator';

export const CustomValidators = {
  url,
  matchingValidator,
  weakPasswordValidator,
  emailNureValidator
};
