
import {
  InventoryWithProductNameReturnType
} from '../types/inventoryType';

import sendEmail from '../services/emailService';

// Generate salt and password hash
async function sendEmailWithTemplate(email:string, orderNumber:string, inventoryList: Array<InventoryWithProductNameReturnType>): Promise<string> {
  let html = "<B>您购买的商品列表:</B><br>";
  html += "##products##<br><br>";
  html += "Web3 Epoch Team";

  let lastProductName: string |undefined = '';
  let tmp = ""
  inventoryList.map(item=>{
    if(item.productName!== lastProductName){
      lastProductName = item.productName;
      tmp += "<br>"
      tmp += `<h2>${lastProductName}:</h2>`
    }
    tmp += `<p>${item.content}</p>`;
  })
  html = html.replace("##products##", tmp);

  const messageId = await sendEmail(email, `Order Delivery #${orderNumber}`, html, html);
  return messageId;
}

export default sendEmailWithTemplate;
