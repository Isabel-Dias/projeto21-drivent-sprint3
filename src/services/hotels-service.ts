import { Hotel, TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { PaymentRequiredError } from '@/errors/payment-required-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { HotelsRepository } from '@/repositories/hotels-repository';

async function getAllHotelsByUserId(userId: number): Promise<Hotel[]> {
  const hotels = await HotelsRepository.findHotels();

  if (hotels.length === 0) throw notFoundError();

  await hotelsValidation(userId);

  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  if (!hotelId || typeof hotelId !== 'number') throw notFoundError();

  const resultHotel = await HotelsRepository.findHotelById(hotelId);

  if (!resultHotel) throw notFoundError();

  await hotelsValidation(userId);

  /*const hotel = {
    id: resultHotel.id,
    name: resultHotel.name,
    image: resultHotel.image,
    createdAt: resultHotel.createdAt.toISOString(),
    updatedAt: resultHotel.updatedAt.toISOString(),
    Rooms: resultHotel.Rooms.map(room => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    }))
  }*/

  return resultHotel;
}

async function hotelsValidation(userId: number) {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentWithAddress.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
  if (!ticketType) throw notFoundError();

  if (ticketType.isRemote == true) throw PaymentRequiredError();

  if (ticketType.includesHotel == false) throw PaymentRequiredError();

  if (ticket.status !== TicketStatus.PAID) throw PaymentRequiredError();

  return;
}

export const hotelsService = {
  getAllHotelsByUserId,
  getHotelById,
};
