import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { name } from 'ejs';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto, @User() user: IUser) {
    return this.bookService.create(createBookDto, user);
  }
  @Get('/book')
  findAllBook() {
    return this.bookService.findAllBook();
  }

  @Get('/mainText/:name')
  findByName(@Param('name') name: string) {
    return this.bookService.findByName(name);
  }

  @Get()
  @Public()
  @ResponseMessage('fetch book with paginate')
  findAllWithPaginate(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.bookService.findAllWithPaginate(+currentPage, +limit, qs);
  }

  @Get(':id')
  findById(@Param('id') id: string, @User() user: IUser) {
    return this.bookService.findById(id, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() user: IUser,
  ) {
    return this.bookService.update(id, updateBookDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.bookService.remove(id, user);
  }
}
