import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { createItem, getItems, deleteItem } from '../controllers/itemController.js';

const itemRouter = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MULTER STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
  const safeName = file.originalname.replace(/\s+/g, '_');
  cb(null, `${Date.now()}-${safeName}`);
}
});

// MULTER MIDDLEWARE
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ROUTES
itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;
