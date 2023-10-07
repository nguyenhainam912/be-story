import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
//import { CompaniesModule } from './companies/companies.module';
//import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
//import { ResumesModule } from './resumes/resumes.module';
//import { PermissionsModule } from './permissions/permissions.module';
//import { RolesModule } from './roles/roles.module';
//import { DatabasesModule } from './databases/databases.module';
//import { SubscribersModule } from './subscribers/subscribers.module';
//import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
//import { HealthModule } from './health/health.module';
import { BookModule } from './book/book.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    //CompaniesModule,
    //JobsModule,
    FilesModule,
    //ResumesModule,
    //PermissionsModule,
    //RolesModule,
    //DatabasesModule,
    //SubscribersModule,
    //MailModule,
    BookModule,
    OrdersModule,
    DatabaseModule,
    //HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
