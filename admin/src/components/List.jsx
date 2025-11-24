import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styles } from '../assets/dummyadmin';
import { FiStar, FiTrash2 } from 'react-icons/fi';

function List() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('https://foodiesweb-1.onrender.com/api/items');
        setItems(data);
      } catch (error) {
        console.error('Error Fetching Items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`https://foodiesweb-1.onrender.comapi/items/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      console.log('Deleted item ID', itemId);
    } catch (error) {
      console.error('Error Deleting items:', error);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-xl ${
          i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'
        }`}
      />
    ));

  if (loading) {
    return (
      <div className={`${styles.pageWrapper} flex items-center justify-center text-amber-100`}>
        Loading New...
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className='max-w-7xl mx-auto'>
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Delete</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className={styles.tr}>
                    <td><img src={item.imageUrl} alt={item.name} className={styles.img} /></td>
                    <td className={styles.nameCell}>
                      <div className='space-y-1'>
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td>{item.price}</td>
                    <td className='flex'>{renderStars(item.rating)}</td>
                    <td>{item.hearts}</td>
                    <td className={styles.thCenter}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className={styles.deleteBtn}
                      >
                        <FiTrash2 className='text-2xl'/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           
           {items.length === 0 && (
            <div className={styles.emptyState}>
                No items found in the menu
            </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default List;
