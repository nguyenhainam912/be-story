import { IsNotEmpty } from 'class-validator';

export class CreateDatabaseDto {
  @IsNotEmpty()
  category: string;
}
