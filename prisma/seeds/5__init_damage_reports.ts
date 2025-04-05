import { ReservationStatus, type PrismaClient } from '@prisma/client';
import { getAdmin } from 'prisma/seeds/1__init_users';
import { getReservations } from 'prisma/seeds/4__init_reservations';
import { uid } from 'uid';

export async function initDamageReports(prisma: PrismaClient) {
  const reservations = await getReservations(prisma);
  if (reservations.length === 0) {
    throw new Error('No reservations found');
  }
  const admin = await getAdmin(prisma);
  if (!admin) {
    throw new Error('No admin found');
  }

  const damaged = reservations.filter(
    (r) => r.status === ReservationStatus.DAMAGED,
  );
  damaged.reduce(async (promise, reservation) => {
    await promise;

    const reportDate = new Date(reservation.startDate);
    reportDate.setDate(reportDate.getDate() + 1);

    await prisma.damageReport.create({
      data: {
        reservationId: reservation.id,
        createdBy: admin.id,
        description: 'Test damage report',
        price: Math.floor((Math.random() * 5 + 0.5) * reservation.price),
        date: reportDate,
        photos: {
          create: [
            { photoUrl: `https://file.storage/${uid()}` },
            { photoUrl: `https://file.storage/${uid()}` },
          ],
        },
      },
    });
  }, Promise.resolve());
}
