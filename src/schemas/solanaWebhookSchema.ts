import * as yup from 'yup';

export interface RawSchema {  
  amount:number ;
  fromUserAccount: string;
  toUserAccount: string;
}

export interface TransfersSchema {
  nativeTransfers: Array<RawSchema>,
  signature: string
}

const rawSchema: yup.SchemaOf<RawSchema> = yup.object().shape({
  amount:yup.number().required(),
  fromUserAccount:yup.string().required(),
  toUserAccount: yup.string().required()
});

export const transfersSchema: yup.SchemaOf<TransfersSchema> = yup.object().shape({
  signature: yup
    .string()
    .required({ message: 'signature is required.' }),
  nativeTransfers: yup
    .array().of(rawSchema)
    .required({ message: 'nativeTransfers is required.' }),
});
