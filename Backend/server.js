import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {connectDB} from './config/db.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRoute.js';
import itemRouter from './routes/ItemRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Updated CORS - All possible ports allowed
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173'   // Vite preview
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not Allowed By CORS'));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure uploads folder exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/user', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// Test route
app.get('/', (req, res) => res.send('API WORKING'));


(async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`✅ Server started on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message || err);
    process.exit(1);
  }
})();