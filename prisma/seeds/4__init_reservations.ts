import {
  ReservationStatus,
  type PrismaClient,
  type Reservation,
} from '@prisma/client';
import { getRegularUsers } from 'prisma/seeds/1__init_users';
import { getCars } from 'prisma/seeds/3__init_cars';

export async function initReservations(prisma: PrismaClient) {
  const users = await getRegularUsers(prisma);
  const cars = await getCars(prisma);
  if (cars.length === 0) {
    throw new Error('No cars found');
  }
  if (users.length === 0) {
    throw new Error('No users found');
  }

  await prisma.reservation.createMany({
    data: reservations.map((reservation) => {
      const { user, car, ...data } = reservation;
      const foundCar = cars.find((c) => c.name === car) || cars[0];
      return {
        ...data,
        userId: (users.find((u) => u.name === user) || users[0]).id,
        carId: foundCar.id,
        price: foundCar.pricePerDay * data.duration,
      };
    }),
  });
}

export async function getReservations(prisma: PrismaClient) {
  return prisma.reservation.findMany({
    where: {
      startDate: {
        lt: new Date('2025-01-01'),
      },
    },
    include: {
      damageReport: true,
    },
  });
}

const reservations: (Omit<
  Reservation,
  'id' | 'userId' | 'carId' | 'price' | 'paymentId'
> & {
  user: string;
  car: string;
})[] = [
  {
    user: 'User1',
    car: 'Corolla',
    startDate: new Date('2024-04-01'),
    duration: 7,
    status: ReservationStatus.PENDING,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User2',
    car: 'Camry',
    startDate: new Date('2024-04-10'),
    duration: 5,
    status: ReservationStatus.PENDING,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User2',
    car: 'Mustang',
    startDate: new Date('2024-04-15'),
    duration: 3,
    status: ReservationStatus.CONFIRMED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'F-150',
    startDate: new Date('2024-04-20'),
    duration: 10,
    status: ReservationStatus.CONFIRMED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'Rav4',
    startDate: new Date('2024-05-01'),
    duration: 4,
    status: ReservationStatus.CANCELLED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'Escape',
    startDate: new Date('2024-05-10'),
    duration: 6,
    status: ReservationStatus.CANCELLED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'Prius',
    startDate: new Date('2024-05-15'),
    duration: 8,
    status: ReservationStatus.PAYED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User2',
    car: 'Civic',
    startDate: new Date('2024-05-20'),
    duration: 5,
    status: ReservationStatus.PAYED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User2',
    car: 'Jetta',
    startDate: new Date('2024-06-01'),
    duration: 7,
    status: ReservationStatus.DAMAGED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User2',
    car: 'Altima',
    startDate: new Date('2024-06-10'),
    duration: 4,
    status: ReservationStatus.DAMAGED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'Accord',
    startDate: new Date('2024-06-15'),
    duration: 10,
    status: ReservationStatus.COMPLETED,
    issuedAt: new Date('2024-03-01'),
  },
  {
    user: 'User1',
    car: 'Malibu',
    startDate: new Date('2024-06-25'),
    duration: 3,
    status: ReservationStatus.COMPLETED,
    issuedAt: new Date('2024-03-01'),
  },
];
