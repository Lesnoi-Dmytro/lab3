import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationService } from 'src/reservation/reservation.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
  ) {}

  public async initiatePayment(amount: number) {
    const taxedAmount = parseFloat((amount * 1.03).toFixed(2));
    const payment = await this.prisma.paymentDetails.create({
      data: {
        amount: taxedAmount,
      },
    });

    return { id: payment.id, amount: taxedAmount };
  }

  public async completePayment(id: number) {
    const status =
      Math.random() > 0.8 ? PaymentStatus.FAILED : PaymentStatus.SUCCESS;

    const payment = await this.prisma.paymentDetails.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    try {
      this.reservationService.payedReservation(id);
    } catch (error) {
      throw new BadRequestException('Payment failed');
    }

    return payment;
  }

  public async initiateRefund(id: number) {
    const payment = await this.prisma.paymentDetails.update({
      where: {
        id,
      },
      data: {
        status: PaymentStatus.REFUNDING,
      },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    setTimeout(() => {
      this.prisma.paymentDetails.update({
        where: {
          id,
        },
        data: {
          status: PaymentStatus.REFUNDED,
        },
      });

      this.reservationService.completeReservation(id);
    }, 2000);
  }
}
