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
        throw new Error();
      } 
      
      const validateBody = transfersSchema.validate(req.body);
      req.body = validateBody;

      next();
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  };
}

export default authValidateWebhook;