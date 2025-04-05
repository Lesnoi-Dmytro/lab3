import {
  PaymentStatus,
  ReservationStatus,
  type PrismaClient,
  type Reservation,
} from '@prisma/client';
import { getReservations } from 'prisma/seeds/4__init_reservations';

export async function initPayments(prisma: PrismaClient) {
  const reservations = await getReservations(prisma);
  if (reservations.length === 0) {
    throw new Error('No reservations found');
  }

  const payed = reservations.filter(
    (r) =>
      r.status === ReservationStatus.PAYED ||
      ReservationStatus.DAMAGED ||
      ReservationStatus.COMPLETED,
  );
  payed.reduce(async (promise, reservation) => {
    await promise;

    fillPaymenAttempts(prisma, reservation, new Date(reservation.issuedAt));

    if (reservation.damageReport) {
      fillPaymenAttempts(
        prisma,
        reservation,
        new Date(reservation.damageReport.date),
      );
    }
  }, Promise.resolve());
}

async function fillPaymenAttempts(
  prisma: PrismaClient,
  reservation: Reservation,
  issuedAt: Date,
) {
  let failed;
  do {
    failed = Math.random() < 0.1;
    issuedAt.setHours(issuedAt.getHours() + 1);

    await prisma.paymentDetails.create({
      data: {
        amount: reservation.price,
        status: failed ? PaymentStatus.FAILED : PaymentStatus.SUCCESS,
        issuedAt,
      },
    });
  } while (failed);
}
