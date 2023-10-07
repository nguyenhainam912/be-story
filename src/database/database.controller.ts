import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { Public } from 'src/decorator/customize';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Public()
  @Get('/category')
  findAllCategory() {
    return this.databaseService.findAllCategory();
  }

  @Get('/dashboard')
  findAllDashboard() {
    return this.databaseService.findAllDashboard();
  }
}
