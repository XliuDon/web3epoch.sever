
export interface RawType {  
  amount:number ;
  fromUserAccount: string;
  toUserAccount: string;
}

export interface TransfersType {
  nativeTransfers: Array<RawType>,
  signature: string
}