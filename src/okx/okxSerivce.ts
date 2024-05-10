
import axios from "axios";
// import Base64 from 'crypto-js/enc-base64';
// import CryptoJS from '@types/crypto-js';
import HmacSHA256  from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
const querystring = require('querystring');

// const cryptoJS = require('crypto-js'); // Import encryption modules for subsequent encryption calculations
// const { Web3 } = require('web3'); // Import the Web3 library for interacting with Ethereum

const chainIds = ["1","56","137","79","43114"]
const apiBaseUrl = 'https://www.okx.com'; // Define the underlying path of the request
// const web3RpcUrl = 'https://.....pro'; // The URL for the Ethereum node you want to connect to
// const privateKey = '0x...xxx'; // Set the private key of your wallet (replace '0x...xxx' with your actual private key). NEVER SHARE THIS WITH ANYONE!
// const chainId = '1';
// const fromTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';    // Native token address
// const toTokenAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';

// const userWalletAddress = '71A6EC3962EEDB27EA1D392A289713F9'; // User wallet address
// const secretKey = '71A6EC3962EEDB27EA1D392A289713F9'; // The key obtained from the previous application
// const apiKey = 'a19c2a7e-ee9a-4186-ae93-2d095441e8b7'; // The api Key obtained from the previous application
// const passphrase = 'IopJkl$2024'; // The password created when applying for the key
// const date = new Date(); // Get the current time
// const timestamp = date.toISOString(); // Convert the current time to the desired format
// const web3 = new Web3(new Web3.providers.HttpProvider(web3RpcUrl)); //Establishing web3 link

// const headersParams = {
//     'Content-Type': 'application/json',
//     'OK-ACCESS-KEY': apiKey,
//     'OK-ACCESS-SIGN': cryptoJS.enc.Base64.stringify(
//       cryptoJS.HmacSHA256(timestamp + 'GET' + '/api/v5/dex/aggregator/xxx?xxx=xxx', secretKey)
//     ),
//     'OK-ACCESS-TIMESTAMP': timestamp,
//     'OK-ACCESS-PASSPHRASE': passphrase,
//   };
  
const getRequestUrl = (apiBaseUrl:string, api:string, queryParams:any) => {
    if(queryParams==null){
        return apiBaseUrl + api;
    }
    return apiBaseUrl + api + '?' + new URLSearchParams(queryParams).toString();
  };


// 定义 API 凭证和项目 ID
const api_config = {
    api_key: 'a19c2a7e-ee9a-4186-ae93-2d095441e8b7',
    secret_key: '71A6EC3962EEDB27EA1D392A289713F9',
    passphrase: 'IopJkl$2024',
    project: 'c48624bb5ec4f1f41b241a39e21937c3' // 此处仅适用于 WaaS APIs
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
  
    const options = {
      hostname: 'www.okx.com',
      path: request_path,
      method: 'POST',
      headers: headers
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
  
//   // GET 请求示例
//   const getRequestPath = '/api/v5/dex/aggregator/quote';
//   const getParams = {
//     'chainId': 42161,
//     'amount': 1000000000000,
//     'toTokenAddress': '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
//     'fromTokenAddress': '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
//   };
//   sendGetRequest(getRequestPath, getParams);
  
//   // POST 请求示例
//   const postRequestPath = '/api/v5/mktplace/nft/ordinals/listings';
//   const postParams = {
//     slug: 'sats'
//   };
//   sendPostRequest(postRequestPath, postParams);

export async function subscrible(){

    chainIds.map(async(chainId)=>{
        const params = {
            callbackUrl:"https://www.web3epoch.com/api/paymenthook",
            type:"TRANSACTION",
            chainId:chainId
          };
    
        const api = '/api/v5/waas/subscribe';   
    
        const result = await sendPostRequest(api,params);
        if(result && (result.data.code === 0||result.status===200)){
            console.debug(`✅ subscrible chain success: ${chainId}`);
        }else{
            console.debug(`❌subscrible fail: ${chainId}`);
        }
    })
}

export async function unsubscrible(){

    chainIds.map(async(chainId)=>{
        const params = {
            callbackUrl:"https://www.web3epoch.com/api/paymenthook",
            type:"TRANSACTION",
            chainId:chainId
          };
    
        const api = '/api/v5/waas/unsubscribe';   
    
        const result = await sendPostRequest(api,params);
        if(result && result.data.code === 0){
            console.debug(`subscrible chain success: ${chainId}`);
        }else{
            console.debug(`subscrible fail: ${chainId}`,result);
        }
    })
}
