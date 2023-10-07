import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
export class CreateBookDto {
  @IsNotEmpty()
  mainText: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  category: String;

  @IsString()
  thumbnail: string;

  slider: string;

  @IsNumber()
  sold: Number;

  @IsNumber()
  quantity: Number;
}
