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

// 🧑‍💼 ADMIN ROUTES → protect with auth
orderRouter.use(authMiddleware);
orderRouter.get('/getall', getAllOrders);
orderRouter.put('/update/:id', updateAnyOrder); // fixed route to /update/:id

// USER ROUTES
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);

export default orderRouter;
