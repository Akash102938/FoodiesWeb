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

// -------------------- ADMIN ROUTES --------------------

// Get all orders (Admin)
orderRouter.get('/getall', getAllOrders);

// UPDATE ORDER STATUS (Admin)  ✅ FIXED ROUTE
orderRouter.put('/update/:id', updateAnyOrder);


// -------------------- PUBLIC ROUTE --------------------

// Stripe confirmation (no auth)
orderRouter.get('/confirm', confirmPayment);


// -------------------- AUTH PROTECTED USER ROUTES --------------------
orderRouter.use(authMiddleware);

// Create new order
orderRouter.post('/', createOrder);

// Get orders of logged-in user
orderRouter.get('/', getOrders);

// Get single order by id
orderRouter.get('/:id', getOrderById);

// User update their order
orderRouter.put('/:id', updateOrder);

export default orderRouter;
