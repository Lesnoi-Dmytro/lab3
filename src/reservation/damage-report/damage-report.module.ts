import { Module } from '@nestjs/common';
import { DamageReportController } from './damage-report.controller';
import { DamageReportService } from './damage-report.service';
import { PaymentModule } from 'src/payment/payment.module';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
  controllers: [DamageReportController],
  providers: [DamageReportService],
  imports: [ReservationModule, PaymentModule],
})
export class DamageReportModule {}
