
import axios from "axios";
// import Base64 from 'crypto-js/enc-base64';
// import CryptoJS from '@types/crypto-js';
import HmacSHA256  from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import {OkxTransactions} from '../types/paymentType';

const querystring = require('querystring');

// const cryptoJS = require('crypto-js'); // Import encryption modules for subsequent encryption calculations
// const { Web3 } = require('web3'); // Import the Web3 library for interacting with Ethereum
interface TransactionsRequest {  
  walletId: string;
  chainIds: Array<string>;
  lastRowId: string;
  limit: string;
  startDate: string;
  endDate: string;
}

export const chains = [  
  {
      chainId:'195',
      coinSymbol:'USDT',
      wallet:'TPoWhurgMhi9eUFiaNsNiQ8WcERtjACRg5',
  },
  {
      chainId:'56',
      coinSymbol:'BUSD',
      wallet:'0xd697a17b2772dbd3ce06edd6c6213b0c5772401f',
  },
  {
      chainId:'1',
      coinSymbol:'USDT',
      wallet:'0xd697a17b2772dbd3ce06edd6c6213b0c5772401f',
  },
  {
      chainId:'137',
      coinSymbol:'USDC',
      wallet:'0xd697a17b2772dbd3ce06edd6c6213b0c5772401f',
  },
  // {
  //     chainId:'SOL',
  //     chainName:'USDC',
  //     wallet:'8Hxvx87m1JometVdRqABWyCPta51zB5f9M85R7XAV6SP',
  // },
]

const chainIds = ["1","56","137","195"]
const apiBaseUrl = 'https://www.okx.com'; // Define the underlying path of the request
  
const getRequestUrl = (apiBaseUrl:string, api:string, queryParams:any) => {
    if(queryParams===null){
        return apiBaseUrl + api;
    }
    return apiBaseUrl + api + '?' + new URLSearchParams(queryParams).toString();
  };


// 定义 API 凭证和项目 ID
const api_config = {
    api_key: '98e3f2f2-f3e5-4dca-b4e2-0d052b4e41e0',
    secret_key: '18A04E1F7ACB744EF122F9A63A9D0B2E',
    passphrase: 'IopJkl$2024',
    project: '239a874c51087c5fa4d36680121743e6' // 此处仅适用于 WaaS APIs
  };
  
  function preHash(timestamp:string, method:string, request_path:string, params:any) {
    // 根据字符串和参数创建预签名
    let query_string = '';
    if (method === 'GET' && params) {
      query_string = '?' + querystring.stringify(params);
    }
    if (method === 'POST' && params) {
      query_string = JSON.stringify(params);
    }
    return timestamp + method + request_path + query_string;
  }
  
  function sign(message:string, secret_key:string) {
    // 使用 HMAC-SHA256 对预签名字符串进行签名
    const hmac = HmacSHA256(message, secret_key);    
    return Base64.stringify(hmac);
  }
  
  function createSignature(method:string, request_path:string, params:any) {
    // 获取 ISO 8601 格式时间戳
    const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
    // 生成签名
    const message = preHash(timestamp, method, request_path, params);    
    const signature = sign(message, api_config.secret_key);
    return { signature, timestamp };
  }
  
  async function sendGetRequest(request_path:string, params:any) {
    // 生成签名
    const { signature, timestamp } = createSignature("GET", request_path, params);
  
    // 生成请求头
    const headers = {
      'OK-ACCESS-KEY': api_config['api_key'],
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
      'OK-ACCESS-PROJECT': api_config['project'] // 这仅适用于 WaaS APIs
    };
  
    const options = {
      hostname: 'www.okx.com',
      path: request_path + (params ? `?${querystring.stringify(params)}` : ''),
      method: 'GET',
      headers: headers
    };
  
    try{        
        const response =await axios.get(getRequestUrl(apiBaseUrl,request_path,params),
            { 
                headers: headers
            }
        );

        return response;

    }catch (err) {
        console.log(err)
        return null;
    }
  }
  
  async function sendPostRequest(request_path:string, params:any) {
    // 生成签名
    const { signature, timestamp } = createSignature("POST", request_path, params);
  
    // 生成请求头
    const headers = {
      'OK-ACCESS-KEY': api_config.api_key,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': api_config.passphrase,
      'OK-ACCESS-PROJECT': api_config.project, // 这仅适用于 WaaS APIs
      'Content-Type': 'application/json' // POST 请求需要加上这个头部
    };
  
    try{        
        const response =await axios.post(getRequestUrl(apiBaseUrl,request_path,null),
            {
              ...params
            },
            { 
                headers: headers
            }
        );

        return response;
    }catch (err) {
        console.log(err)
        return null;
    }
  
  }
  
async function checkscrible(params: any):Promise<boolean>{

  const api = '/api/v5/waas/check-subscribe';   
  
  const result = await sendPostRequest(api,params);
  console.log('check subscrible', result?.data)
  if(result && result.data.code === 0 &&(result.data.data[0]===true)){
      return true;
  }
  return false;
}

export async function subscrible(){

    chainIds.map(async(chainId)=>{
        const params = {
            callbackUrl:"https://webhook.site/efdf3955-20de-49aa-ac9c-97b9b5002319",//"https://web3epoch.xyz/api/paymenthook",
            type:"TRANSACTION",
            chainId:chainId
          };
    
        if(!await checkscrible(params)){
          const api = '/api/v5/waas/subscribe';   
    
          const result = await sendPostRequest(api,params);
          console.log('subscrible result', result?.data)
          if(result && (result.data.code === 0)){
              console.debug(`✅ subscrible chain success: ${chainId}`);
          }else{
              console.debug(`❌subscrible fail: ${chainId}`);
          }
        }       
    })
}

export async function unsubscrible(){

    chainIds.map(async(chainId)=>{
        const params = {
            callbackUrl:"https://www.web3epoch.xyz/api/paymenthook",
            type:"TRANSACTION",
            chainId:chainId
          };
    
        const api = '/api/v5/waas/unsubscribe';   
    
        const result = await sendPostRequest(api,params);
        if(result && result.data.code === 0){
            console.debug(`✅subscrible chain success: ${chainId}`);
        }else{
            console.debug(`❌subscrible fail: ${chainId}`,result);
        }
    })
}

export async function getTransations(startDate: Date, endDate: Date): Promise<Array<OkxTransactions> | null>{

  const transactions :Array<OkxTransactions> = [];
  await Promise.all(chains.map(async(chainId)=>{
      const payload: TransactionsRequest = {  
        walletId: chainId.wallet,
        chainIds: [chainId.chainId],
        lastRowId:"",
        limit: "20",
        startDate: dateInYyyyMmDdHhMmSs(startDate),
        endDate: dateInYyyyMmDdHhMmSs(endDate)
      }
      
      const api = '/api/v5/waas/transaction/get-transactions';   
  
      const result = await sendPostRequest(api, payload);
      if(result && result.data.code === 0){
          // console.debug(`✅subscrible chain success: ${chainId}`);
            result.data.map((pay:any)=>{
              try{
              if(pay.txType === "1"){
                if(pay.assetSummary.coinSymbol === chainId.coinSymbol){
                  transactions.push( {
                      chainId: pay.chainId,
                      txHash: pay.txHash,
                      fromAddr: pay.fromAddr,
                      toAddr: pay.toAddr,
                      txTime: pay.txTime,
                      coinAmount: pay.coinAmount,
                      coinSymbol: pay.coinSymbol,
                    }
                  )
                }
              }
            }catch(error: any){
             console.log(error.message); 
            }
          })
      }
  })
  )

  return transactions;
}

function padTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

function dateInYyyyMmDdHhMmSs(date: Date, dateDiveder: string = "-") {
  // :::: Exmple Usage ::::
  // The function takes a Date object as a parameter and formats the date as YYYY-MM-DD hh:mm:ss.
  // 👇️ 2023-04-11 16:21:23 (yyyy-mm-dd hh:mm:ss)
  //console.log(dateInYyyyMmDdHhMmSs(new Date()));

  //  👇️️ 2025-05-04 05:24:07 (yyyy-mm-dd hh:mm:ss)
  // console.log(dateInYyyyMmDdHhMmSs(new Date('May 04, 2025 05:24:07')));
  // Date divider
  // 👇️ 01/04/2023 10:20:07 (MM/DD/YYYY hh:mm:ss)
  // console.log(dateInYyyyMmDdHhMmSs(new Date(), "/"));
  return (
    [
      date.getFullYear(),
      padTwoDigits(date.getMonth() + 1),
      padTwoDigits(date.getDate()),
    ].join(dateDiveder) +
    " " +
    [
      padTwoDigits(date.getHours()),
      padTwoDigits(date.getMinutes()),
      padTwoDigits(date.getSeconds()),
    ].join(":")
  );
}