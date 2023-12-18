import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

function findHotelById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

export const HotelsRepository = {
  findHotels,
  findHotelById,
};
