import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: SoftDeleteModel<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto, user: IUser) {
    let book = await this.bookModel.create({
      ...createBookDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return book;
  }

  async findAllWithPaginate(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.bookModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.bookModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findById(id: string, user: IUser) {
    return await this.bookModel.findOne({ _id: id });
  }

  async findByName(name: string) {
    return await this.bookModel.findOne({ mainText: name });
  }

  async findAllBook() {
    return await this.bookModel.find({}).select('mainText');
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: IUser) {
    return await this.bookModel.updateOne(
      { _id: id },
      { ...updateBookDto, updatedBy: { email: user.email, _id: user._id } },
    );
  }

  async remove(id: string, user: IUser) {
    await this.bookModel.updateOne(
      { _id: id },
      { deletedBy: { email: user.email, _id: user._id } },
    );
    return await this.bookModel.softDelete({ _id: id });
  }
}
