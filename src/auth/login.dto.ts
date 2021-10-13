import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  readonly loginToken?: string | undefined;

  readonly expirationLoginToken?: string | undefined;
}
