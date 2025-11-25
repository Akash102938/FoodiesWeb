import React, { useState } from 'react';
import { FiHeart, FiStar, FiUpload } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import { styles } from '../assets/dummyadmin';

function AddItems() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: 0,
    hearts: 0,
    image: null,
    preview: ''
  });

  const [categories] = useState([
    'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'
  ]);

  const [hoverRating, setHoverRating] = useState(0);

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  // Handle rating & hearts
  const handleRating = rating => setFormData(prev => ({ ...prev, rating }));
  const handleHearts = () => setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));

  // Submit form
  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'preview') return; // do not send preview
        payload.append(key, val);
      });

      const res = await axios.post(
        'https://foodiesweb-1.onrender.com/api/items',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Item added successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        rating: 0,
        hearts: 0,
        image: null,
        preview: ''
      });

    } catch (err) {
      console.error(err.response || err.message);
      alert(err.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className='max-w-4xl mx-auto'>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Menu Item</h2>

          <form className='space-y-8' onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                {formData.preview ? (
                  <img src={formData.preview} alt="Preview" className={styles.previewImage} />
                ) : (
                  <div className='text-center p-4'>
                    <FiUpload className={styles.uploadIcon} />
                    <p className={styles.uploadText}>Click to upload product image</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Product Details */}
            <div className='space-y-6'>
              <div>
                <label className='block mb-2 text-base sm:text-lg text-amber-400'>Product Name</label>
                <input
                  type="text"
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  placeholder='Enter Product Name'
                  required
                />
              </div>

              <div>
                <label className='block mb-2 text-base sm:text-lg text-amber-400'>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Enter Product Description'
                  className={styles.inputField + ' h-32 sm:h-40'}
                  required
                />
              </div>

              <div className={styles.gridTwoCols}>
                <div>
                  <label className='block mb-2 text-base sm:text-lg text-amber-400'>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block mb-2 text-base sm:text-lg text-amber-400'>Price (₹)</label>
                  <div className={styles.relativeInput}>
                    <FaRupeeSign className={styles.rupeeIcon} />
                    <input
                      type="number"
                      name='price'
                      value={formData.price}
                      onChange={handleInputChange}
                      className={styles.inputField + ' pl-10 sm:pl-12'}
                      placeholder='Enter Price'
                      min='0'
                      step='0.01'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Rating & Popularity */}
              <div className={styles.gridTwoCols}>
                <div>
                  <label className='block mb-2 text-base sm:text-lg text-amber-400'>Rating</label>
                  <div className='flex gap-2'>
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type='button'
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className='text-2xl sm:text-3xl transition-transform hover:scale-110'
                      >
                        <FiStar
                          className={star <= (hoverRating || formData.rating) ? 'text-amber-400 fill-current' : 'text-amber-100/30'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block mb-2 text-base sm:text-lg text-amber-400'>Popularity</label>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <button type='button' onClick={handleHearts} className='text-2xl sm:text-3xl text-amber-400 hover:text-amber-300 transition-colors animate-pulse'>
                      <FiHeart />
                    </button>
                    <input
                      type="number"
                      name='hearts'
                      value={formData.hearts}
                      onChange={handleInputChange}
                      className={`${styles.inputField} pl-10 sm:pl-12`}
                      placeholder='Enter Likes'
                      min='0'
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3 rounded-lg transition-colors duration-200'
            >
              Add To Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItems;
