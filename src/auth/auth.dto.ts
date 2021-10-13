import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  readonly loginToken: string;
}
