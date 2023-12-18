import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await hotelsService.getAllHotelsByUserId(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  const hotel = await hotelsService.getHotelById(hotelId, userId);

  return res.status(httpStatus.OK).send(hotel);
}
