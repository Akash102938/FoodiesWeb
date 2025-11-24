import asyncHandler from 'express-async-handler';
import { CartItem } from '../modals/cartModel.js';
import mongoose from 'mongoose';

// ✅ GET CART
export const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate('item');
  const formatted = items.map(ci => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity,
  }));
  res.status(200).json(formatted);
});

// ✅ ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || typeof quantity !== 'number') {
    res.status(400);
    throw new Error('itemId and quantity are required');
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid itemId');
  }

  let cartItem = await CartItem.findOne({ user: req.user._id, item: itemId });

  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + quantity);
    if (cartItem.quantity < 1) {
      await cartItem.remove();
      return res.status(200).json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: 0,
      });
    }

    await cartItem.save();
    await cartItem.populate('item');
    return res.status(200).json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity,
    });
  }

  // ✅ Fixed here — use Model, not instance
  cartItem = await CartItem.create({
    user: req.user._id,
    item: itemId,
    quantity,
  });

  await cartItem.populate('item');
  res.status(201).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// ✅ UPDATE CART ITEM
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });

  if (!cartItem) {
    res.status(404);
    throw new Error('Cart Item not found');
  }

  if (quantity <= 0) {
    await cartItem.deleteOne();
    return res.status(200).json({ _id: req.params.id, message: 'Item removed from cart' });
  }

  cartItem.quantity = quantity;
  await cartItem.save();
  await cartItem.populate('item');
  res.status(200).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// ✅ DELETE CART ITEM
export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });
  if (!cartItem) {
    res.status(404);
    throw new Error('Cart Item not found');
  }
  await cartItem.deleteOne();
  res.status(200).json({ _id: req.params.id });
});

// ✅ CLEAR CART
export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.status(200).json({ message: 'Cart cleared' });
});
