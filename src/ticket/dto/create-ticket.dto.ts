import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateTicketDto {
  @IsString()
  @Length(1, 200)
  readonly title: string;

  @IsString()
  @Length(1, 5000)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly date: Date;

  @IsNotEmpty()
  @IsString()
  readonly hour: string;

  @IsBoolean()
  readonly isActive: boolean;

  @IsBoolean()
  readonly hasVariation: boolean;

  @IsBoolean()
  readonly isOnline: boolean;

  @IsNumber()
  readonly priceStandard: number;

  @IsNumber()
  readonly pricePremium: number;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly link: string | undefined;

  @IsString()
  readonly address: string | undefined;

  readonly imageUrl: string | undefined;

  readonly latitude: number | undefined;

  readonly longitude: number | undefined;

  @IsInt()
  readonly quantity: number;

  readonly sellerId: User | undefined;

  @IsNotEmpty()
  readonly category: Category;
}
