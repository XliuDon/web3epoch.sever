import { Request, Response, NextFunction } from 'express';
import {transfersSchema} from '../schemas/solanaWebhookSchema';

function authValidateWebhook() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = req.header('authorization')?.replace('Bearer ', '');
      if (!token || token !== process.env.WEBHOOK_AUTH) {
        throw new Error('authorization fail');
      } 
      
      const validateBody = await transfersSchema.validate(req.body[0]);
      
      if(!validateBody.tokenTransfers || validateBody.tokenTransfers[0].mint !== 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'){
          throw new Error('pay wrong token!')
      }
      req.body = validateBody;

      next();
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  };
}

export default authValidateWebhook;