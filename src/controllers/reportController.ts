import { Request, Response } from 'express';
import { getSalesReport } from '../services/reportService';
import getUserId from '../utils/userInfo';

export async function getDashboardReportController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getSalesReport();

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}