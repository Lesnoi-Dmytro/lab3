import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';
import { DamageReportModule } from 'src/reservation/damage-report/damage-report.module';

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CarsModule,
    ReservationModule,
    PaymentModule,
    DamageReportModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService, UsersService],
  exports: [PrismaService],
})
export class AppModule {}
