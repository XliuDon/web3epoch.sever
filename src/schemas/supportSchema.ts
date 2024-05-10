import * as yup from 'yup';

export interface SupportSchema {
  id: string | undefined;
  email: string | undefined;
  message: string | undefined;
  status: number | undefined;
}

export const supportSchema: yup.SchemaOf<SupportSchema> = yup.object().shape({
  id: yup
    .string(),
  email: yup
    .string()
    .required({ message: 'Email is required.' }),
    message: yup
    .string()
    .required({ message: 'Message is required.' }),
    status: yup
    .number()
});

export const updateSupportStatusSchema: yup.SchemaOf<SupportSchema> = yup.object().shape({
  id: yup
    .string()
    .required({ message: 'Id is required.' }),
    email: yup
    .string(),
    message: yup
    .string(),    
    status: yup
    .number()
    .required({ message: 'Status is required.' }),
});