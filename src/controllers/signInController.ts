import { Request, Response } from 'express';
import { signInUser } from '../services/userService';

async function logInController(req: Request, res: Response): Promise<Response> {
  const userCredentials = req.body;
  const response = await signInUser(userCredentials);

  if (response.success === true) {
    return res.status(response.status).json(response.data);
  }

  return res.status(response.status).json(response.data);
}

export default logInController;
