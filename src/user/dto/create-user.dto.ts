import { IsEmail, IsString, Length } from 'class-validator';
import { Role } from '../entities/role/role.enum';

export class CreateUserDto {
  @IsString()
  @Length(1, 200)
  readonly fullName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  readonly loginToken?: string | undefined;

  readonly role?: Role;

  readonly expirationLoginToken?: string | undefined;
}
