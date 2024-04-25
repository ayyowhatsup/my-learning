import { PartialType } from '@nestjs/mapped-types';
import { UserRegistrationTemplateData } from './user-registration-template-data.dto';

export default class UserResetPasswordTemplateData extends PartialType(
  UserRegistrationTemplateData,
) {}
