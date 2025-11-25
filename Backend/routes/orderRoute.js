import express from 'express';
import {
  confirmPayment,
  getAllOrders,
  createOrder,
  getOrderById,
  getOrders,
  updateAnyOrder,
  updateOrder
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// ⭐ PUBLIC route for Stripe confirmation
orderRouter.get('/confirm', confirmPayment);

// 🧑‍💼 ADMIN ROUTES - require admin auth
orderRouter.get('/getall', authMiddleware('admin'), getAllOrders);
orderRouter.put('/getall/:id', authMiddleware('admin'), updateAnyOrder);

// 🔐 USER ROUTES - require user auth
orderRouter.use(authMiddleware()); // normal user auth

orderRouter.post('/', createOrder);          // create order
orderRouter.get('/', getOrders);            // get logged-in user's orders
orderRouter.get('/:id', getOrderById);      // get order by id
orderRouter.put('/:id', updateOrder);       // user update their own order

export default orderRouter;
