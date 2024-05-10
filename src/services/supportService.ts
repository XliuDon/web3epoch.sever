import {
  CreateSupportInput,
  ReturnType,
  SupportDocument,
  UpdateSupportStatusInput,
} from 'src/types/supportType';

import Support from '../models/supportModel';

// Create new support
export async function createSupport(
  supportData: CreateSupportInput
): Promise<ReturnType<Omit<SupportDocument, 'Support'>>> {
  

  try {   
        const newSupport = await Support.create({
          email: supportData.email,
          message: supportData.message
    });

    return {
      success: true,
      status: 200,
      message: 'Support created successfully.',
      data: newSupport,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function getPendingSupport(): Promise<ReturnType<Array<SupportDocument>>> {
 
  try {        
    const supports = await Support.find({ status: 0 }).sort({createdAt:1});

    return {
      success: true,
      status: 200,
      message: 'get pending successfully.',
      data: supports
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function getAllSupport(): Promise<ReturnType<Array<SupportDocument>>> {
 
  try {        
    const supports = await Support.find().sort({createdAt:-1});

    return {
      success: true,
      status: 200,
      message: 'get all supports successfully.',
      data: supports
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function updateSupportStatus(
  supportData: UpdateSupportStatusInput
): Promise<ReturnType<SupportDocument>> {
 
  try {        
    const support = await Support.findByIdAndUpdate(supportData.id, { status: supportData.status });
    if(!support){
      return {
        success: false,
        status: 401,
        message:
          'No pending support found',
        data: null,
      };
    }

    return {
      success: true,
      status: 200,
      message: 'get pending successfully.',
      data: support
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

