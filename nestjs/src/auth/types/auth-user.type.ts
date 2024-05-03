import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/users/entities/user.entity';

export class AuthUser extends PickType(User, ['id']) {
  token: string;
}
