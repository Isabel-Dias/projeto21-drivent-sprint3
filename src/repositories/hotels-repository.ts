import { prisma } from '@/config';

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true}
  })
}

export const HotelsRepository = {
  findHotels,
  findHotelById
};