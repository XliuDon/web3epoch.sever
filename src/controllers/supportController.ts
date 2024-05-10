import { Request, Response } from 'express';
import { 
  createSupport,
  getAllSupport,
  getPendingSupport,
  updateSupportStatus
} from '../services/supportService';


export async function createSupportController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await createSupport(req.body);

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
  
}

export async function updateSupportStatusController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await updateSupportStatus(req.body);

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
  
}

export async function getPendingSupportsController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getPendingSupport();

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
  
}

export async function getAllSupportsController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getAllSupport();

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
  
}