import { Injectable } from '@nestjs/common';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Database, DatabaseDocument } from './schemas/database.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import { UserDocument, User } from 'src/users/schemas/user.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Database.name)
    private databaseModel: SoftDeleteModel<DatabaseDocument>,
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async findAllCategory() {
    let data = await this.databaseModel.findOne({}).select('category -_id');
    return data.category;
  }

  async findAllDashboard() {
    const countOrder = (await this.orderModel.find({})).length;
    const countUser = (await this.userModel.find({})).length;

    return {
      countOrder,
      countUser,
    };
  }
}
