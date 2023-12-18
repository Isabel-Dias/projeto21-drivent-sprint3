import { Hotel, TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { PaymentRequiredError } from '@/errors/payment-required-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { HotelsRepository } from '@/repositories/hotels-repository';

async function getAllHotelsByUserId(userId: number): Promise<Hotel[]> {
  await hotelsValidation(userId);
  
  const hotels = await HotelsRepository.findHotels();

  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number) {
  
  await hotelsValidation(userId);

  if (!hotelId || typeof hotelId !== 'number') throw notFoundError();

  const resultHotel = await HotelsRepository.findHotelById(hotelId);

  if (!resultHotel) throw notFoundError();

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
