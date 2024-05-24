import {
  ReportReturnType,
  ReturnType,
  ProductSalesReturnType
} from 'src/types/reportType';

import Order from '../models/orderModel';
import OrderItem from '../models/orderItemModel';
import Product from '../models/productModel';

interface TodayProductSales { 
  totalSalesPrice: number;
  totalOrderCount:number;
}

interface AllProductSales { 
  allSalesPrice: number;
  allOrderCount:number;
}

interface ProductSales { 
  categoryCode: string,
  productId: string;
  productName:string;
  orderCount: number;
  totalSalesPrice:number;
}

// Create report
export async function getSalesReport(): Promise<ReturnType<ReportReturnType>> {
  
  try {           
    const todaySalesData  = await getTodaySalesReport();
    const allSalesData = await getAllSalesReport();
    const topSalesData = await getTopSalesReport();

    const reportData:ReportReturnType = {
      todayTotalPrice: todaySalesData.totalSalesPrice,
      todayOrderCount:todaySalesData.totalOrderCount,
      totalOrderCount: allSalesData.allOrderCount,
      totalPrice: allSalesData.allSalesPrice,
      topProductSales: topSalesData,
      productsSales: [],
      productsSalesByMonth: [],
      updatedAt: new Date()
    }
    return {
      success: true,
      status: 200,
      message: 'order created successfully.',
      data: reportData,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

async function getTodaySalesReport(): Promise<TodayProductSales> {
  
  try {       
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);  // Set to start of tomorrow
    const results = await Order.aggregate([
      {
        $match: {          
          status:1,
          createdAt: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group:
          {
            _id: { day: { $dayOfYear: "$createdAt"}, year: { $year: "$createdAt" } },
            totalSalesPrice: { $sum: '$totalPrice' },
            totalOrderCount: { $sum: 1 }
          }
      }

    ]);

    if(results.length>0){
      return results[0];
    }

    return {
      totalSalesPrice: 0,
      totalOrderCount:0
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      totalSalesPrice: 0,
      totalOrderCount:0
    };
  }
}


async function getAllSalesReport(): Promise<AllProductSales> {
  
  try {           
    const results = await Order.aggregate([
      {
        $match: {          
          status:1,
        }
      },
      {
        $group:
          {
            _id: null,
            allSalesPrice: { $sum: '$totalPrice' },
            allOrderCount: { $sum: 1 }
          }
      }

    ]);

    if(results.length>0){
      return results[0];
    }

    return {
      allSalesPrice: 0,
      allOrderCount:0
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      allSalesPrice: 0,
      allOrderCount:0
    };
  }
}


async function getTopSalesReport(): Promise<Array<ProductSales>> {
  
  try {           
    const results = await Order.aggregate([
      {
        $match: {          
          status:1,
        }
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: 'orderNumber',
          foreignField: 'orderNumber',
          as: 'orderdetail'
        }
      },
      {
        $unwind: '$orderdetail'
      },
      {
        $lookup: {
          from: 'products',
          let: {
            "searchId": {
              $toObjectId: "$orderdetail.productId"
            }
          },
          pipeline: [
            //searching [searchId] value equals your field [_id]
            {
              "$match": {
                "$expr": [
                  {
                    "_id": "$$searchId"
                  }
                ]
              }
            },
            //projecting only fields you reaaly need, otherwise you will store all - huge data loads
            {
              $project: {
                _id: 1,
                categoryCode: 1
              }
            }
          ],
          as: 'products'
        }
      },
      {
        $unwind: '$products'
      },
      {
        $group: {
          _id: '$orderdetail.productId',          
          productName:{$first: '$orderdetail.productName' },
          categoryCode: {$first: '$products.categoryCode'},
          count: { $sum: "$orderdetail.amount" },
          totalSalesPrice:{ $sum:   { $multiply: ['$orderdetail.price', '$orderdetail.amount'] }  },  
        }      
      },
      {
        $sort: {
          totalSalesPrice: -1  // Sort by total sales price in descending order
        }
      },
      {
        $limit: 10  // Limit the results to the top 10 products
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          categoryCode: 1,
          totalSalesPrice: 1,
          orderCount: '$count'
        }
      }
    ]);

    console.log('top', results)
    
    return results;
    
  } catch (error: any) {
    console.log(error.message);
    return []
  }
}

async function getTotalSalesReport(): Promise<Array<ProductSalesReturnType>> {
  
  try {       
    
    // Order
    // Product
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);  // Set to start of tomorrow

    const results = await Order.aggregate([
      {
        $match: {          
          status:1,
          createdAt: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $lookup: {
          from: 'orderItem',
          localField: 'orderNumber',
          foreignField: 'orderNumber',
          as: 'orderdetail'
        }
      },
      {
        $unwind: '$orderdetail'
      },
      {
        $group: {          
          totalSalesPrice: { $sum: { $multiply: ['$price', '$amount'] } },
          totalOrders: { $sum: '$orderdetail.orderNumber' }          
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: '$productName',
          totalSalesPrice: '$totalSalesPrice',
          orderCount: '$totalCount'
        }
      }
    ]);

    console.log('results',results)

    return results;
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}