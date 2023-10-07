import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  detail: {
    bookName: string;
    quantity: number;
    price: number;
  };

  @IsNotEmpty()
  staffName: String;
}
