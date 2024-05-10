import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// Support create
export interface CreateSupportInput {  
  email: string;
  message: string;
}

// Support status update
export interface UpdateSupportStatusInput {  
  id: string;
  status: number;
}


export interface SupportDocument extends CreateSupportInput, UpdateSupportStatusInput, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
