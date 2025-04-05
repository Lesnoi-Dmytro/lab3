import { PrismaClient, type Seed } from '@prisma/client';
import { initUsers } from 'prisma/seeds/1__init_users';
import { initCarBrands } from 'prisma/seeds/2__init_car_brands';
import { initCars } from 'prisma/seeds/3__init_cars';
import { initReservations } from 'prisma/seeds/4__init_reservations';
import { initDamageReports } from 'prisma/seeds/5__init_damage_reports';
import { initPayments } from 'prisma/seeds/6__init_payments';

const prisma = new PrismaClient();

async function seed() {
  const seedHistory = await prisma.seed.findMany();
  const lastSeedApplied = seedHistory.reduce(
    (prev, max) => Math.max(prev, max.id),
    0,
  );

  checkPreviousSeed(seedHistory, lastSeedApplied);

  const lastSeed = seeds.reduce((prev, max) => Math.max(prev, max.id), 0);

  if (lastSeedApplied < lastSeed) {
    console.log('Seeding...');
    await applySeeds(lastSeedApplied);
    console.log('Seeding complete');
  } else {
    console.log('No seeding required');
  }
}

seed();

function checkPreviousSeed(seedHistory: Seed[], lastSeedApplied: number) {
  seeds
    .filter((seed) => seed.id < lastSeedApplied)
    .forEach((seed) => {
      if (!seedHistory.some((s) => s.id === seed.id)) {
        throw new Error(
          `Seed ${seed.id} could not be applied, as seed ${lastSeedApplied} already applied`,
        );
      }
    });
}

function applySeeds(lastSeedApplied: number) {
  return seeds
    .filter((seed) => seed.id > lastSeedApplied)
    .reduce(async (prev, seed) => {
      await prev;

      console.log(`Running seed ${seed.id}`);
      await seed.fn(prisma);
      await prisma.seed.create({
        data: {
          id: seed.id,
        },
      });
      console.log(`Seed ${seed.id} completed`);
    }, Promise.resolve());
}

const seeds: { id: number; fn: (prisma: PrismaClient) => Promise<void> }[] = [
  {
    id: 1,
    fn: initUsers,
  },
  {
    id: 2,
    fn: initCarBrands,
  },
  {
    id: 3,
    fn: initCars,
  },
  {
    id: 4,
    fn: initReservations,
  },
  {
    id: 5,
    fn: initDamageReports,
  },
  {
    id: 6,
    fn: initPayments,
  },
];
