import {getPendingPayments, updateExpiredPayment} from './paymentService';
import Order from '../models/orderModel';
import { getTransations } from 'src/okx/okxSerivce';

import {
    OkxTransactions,
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


export async function onChainPaymentWatcher(){
    try{
        const pendingPayments = await getPendingPayments();
        if(pendingPayments){
            // if(pendingPayments.data && pendingPayments.data?.length >0){
            //     start
            //     await getTransations()
            // }
            
        }        
    }catch(error:any){
        console.log(error.message)
    }

    setTimeout(async function () {
        await paymentWatcher();
      }, 1000 * 10);
}