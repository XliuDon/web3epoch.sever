import {
    UserDocument
  } from 'src/types/userType';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

// Get user data from token
async function getUserId(req: Request): Promise<string> {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
     
        if (!token) {
          // throw new Error();
          return '0';
        }
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);  
        // console.log(decoded)
        const user = decoded as UserDocument;
     
        return user.id;
    } catch (err) {
        console.log(err)
        return ''
    }
}

export default getUserId;
