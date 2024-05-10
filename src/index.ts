import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import database from './utils/database';
import {subscrible, unsubscrible} from './okx/okxSerivce';
import {paymentWatcher} from './services/paymentWatchdog';

dotenv.config();

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Headers, Authorization'
  );
  res.header("Content-Type","application/x-www-form-urlencoded")
  res.header("Content-Type","multipart/form-data")  
  next();
});
app.use(express.json());

app.listen(process.env.PORT, () => {
  routes(app);
  database();
  // subscrible();
  paymentWatcher()
  console.log(`✅ Server is up and running on port ${process.env.PORT}`);
});
