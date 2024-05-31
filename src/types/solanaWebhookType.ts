
export interface RawType {  
  tokenAmount:number ;
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
}

export interface TransfersType {
  tokenTransfers: Array<RawType>,
  signature: string
}