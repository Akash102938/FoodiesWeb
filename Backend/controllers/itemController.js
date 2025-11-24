import itemModel from '../modals/itemModel.js'

// CREATE ITEM
export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newItem = new itemModel({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imageUrl,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Item name already exists' });
    } else {
      next(error);
    }
  }
};

// GET ALL ITEMS
export const getItems = async (req, res, next) => {
  try {
    const items = await itemModel.find().sort({ createdAt: -1 });
    const host = `${req.protocol}://${req.get('host')}`;

    // ❌ You used itemModel.applyTimestamps (which doesn’t exist)
    // ✅ Instead, map over items to attach full URLs
    const withFullUrl = items.map(i => ({
      ...i.toObject(),
      imageUrl: i.imageUrl ? host + i.imageUrl : '',
    }));

    res.json(withFullUrl);
  } catch (error) {
    next(error);
  }
};

// DELETE ITEM
export const deleteItem = async (req, res, next) => {
  try {
    const removed = await itemModel.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
