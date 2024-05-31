import * as yup from 'yup';

export interface RawSchema {  
  tokenAmount:number ;
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
}

export interface TransfersSchema {
  tokenTransfers: Array<RawSchema>,
  signature: string
}

const rawSchema: yup.SchemaOf<RawSchema> = yup.object().shape({
  tokenAmount:yup.number().required(),
  fromUserAccount:yup.string().required(),
  toUserAccount: yup.string().required(),
  mint: yup.string().required()
});

export const transfersSchema: yup.SchemaOf<TransfersSchema> = yup.object().shape({
  signature: yup
    .string()
    .required({ message: 'signature is required.' }),
  tokenTransfers: yup
    .array().of(rawSchema)
    .required({ message: 'nativeTransfers is required.' }),
});
