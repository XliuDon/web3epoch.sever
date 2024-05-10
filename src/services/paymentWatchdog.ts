import {getPendingPayments, updateExpiredPayment} from './paymentService';
import Order from '../models/orderModel';

import {
    PaymentDocument
  } from 'src/types/paymentType';


export async function paymentWatcher(){
    try{
        const pendingPayments = await getPendingPayments();
        if(pendingPayments){
            (pendingPayments.data as Array<PaymentDocument>).map(async(pay)=>{
                const findOrder = await Order.findOne({ orderNumber: pay.orderNumber, status:0, isDelete:{$ne: true}});
                if(findOrder){
                    const dateNow = new Date ();
                    if(findOrder.expiredAt < dateNow ){
                        findOrder.status = 5; 
                        await findOrder.save();                       
                        await updateExpiredPayment({orderNumber: pay.orderNumber});
                    }
                }                
            })
        }        
    }catch(error:any){
        console.log(error.message)
    }

    setTimeout(async function () {
        await paymentWatcher();
      }, 1000 * 10);
}