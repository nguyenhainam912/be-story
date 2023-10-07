import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async create(createOrderDto: CreateOrderDto, user: IUser) {
    if (createOrderDto.phone) {
      let a = await this.userModel.find({ phone: createOrderDto.phone });
      if ((a = [])) {
        await this.userModel.create({
          email: `${createOrderDto.name}@gmail.com`,
          password: '...',
          fullName: createOrderDto.name,
          phone: createOrderDto.phone,
          address: createOrderDto.address,
          role: 'CUSTOMER',
          createdBy: { _id: user._id, email: user.email },
        });
      }
    }
    await this.orderModel.create({
      ...createOrderDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return "transaction's created success";
  }

  async findAllWithPaginate(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    let result = await this.orderModel
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
}
