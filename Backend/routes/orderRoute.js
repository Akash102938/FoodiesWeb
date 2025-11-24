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

// 🧑‍💼 ADMIN ROUTES
orderRouter.get('/getall', getAllOrders);
orderRouter.put('/getall/:id', updateAnyOrder);

// ⭐ PUBLIC route for Stripe confirmation
orderRouter.get('/confirm', confirmPayment);

// 🔐 All routes below require authentication
orderRouter.use(authMiddleware);

// USER ROUTES
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);

export default orderRouter;
