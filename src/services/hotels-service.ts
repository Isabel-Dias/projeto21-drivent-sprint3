
import { notFoundError } from '@/errors';
import { PaymentRequiredError } from '@/errors/payment-required-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { HotelsRepository } from '@/repositories/hotels-repository';
import { Hotel } from '@prisma/client';



async function getAllHotelsByUserId(userId: number): Promise<Hotel[]> {
  
  await hotelsValidation(userId);

  const hotels = await HotelsRepository.findHotels();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {

  await hotelsValidation(userId);
  
  const resultHotel = await HotelsRepository.findHotelById(hotelId);

  if(!resultHotel) throw notFoundError();

  const hotel = {
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
  }

  return hotel;
}

async function hotelsValidation(userId: number) {
  
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentWithAddress.id);

  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);

  if(!ticketType) throw notFoundError();

  if (ticket.status !== 'PAID' || ticketType.includesHotel === false || ticketType.isRemote === true) throw PaymentRequiredError();

  return;
}

export const hotelsService = {
  getAllHotelsByUserId,
  getHotelById
};
