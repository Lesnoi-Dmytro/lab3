import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ReservationModule } from 'src/reservation/reservation.module';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [forwardRef(() => ReservationModule)],
  exports: [PaymentService],
})
export class PaymentModule {}
