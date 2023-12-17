import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = hotelsService.getAllHotelsByUserId(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotelId = req.params;


  return res.status(httpStatus.OK).send();
}
