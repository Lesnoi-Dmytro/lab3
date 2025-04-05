import { forwardRef, Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [forwardRef(() => PaymentModule)],
  exports: [ReservationService],
})
export class ReservationModule {}
