import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 200)
  readonly fullName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  readonly loginToken?: string | undefined;

  readonly expirationLoginToken?: string | undefined;
}
