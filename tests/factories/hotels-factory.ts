import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  const now = new Date();

  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
      updatedAt: now,
    },
  });
}

export async function createManyRooms(hotelId: number) {
  const now = new Date();
  return await prisma.room.createMany({
    data: [
      {
        name: `${faker.animal.bird()} Suite`,
        capacity: faker.datatype.number(),
        hotelId: Number(hotelId),
        updatedAt: now,
      },
      {
        name: `${faker.animal.bird()} Suite`,
        capacity: faker.datatype.number(),
        hotelId: Number(hotelId),
        updatedAt: now,
      },
      {
        name: `${faker.animal.bird()} Suite`,
        capacity: faker.datatype.number(),
        hotelId: Number(hotelId),
        updatedAt: now,
      },
    ],
  });
}
