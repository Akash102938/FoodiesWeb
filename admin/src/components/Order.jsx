import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { layoutClasses, tableClasses, statusStyles, paymentMethodDetails, iconMap } from '../assets/dummyadmin';
import { FiBox, FiUser } from 'react-icons/fi';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          'https://foodiesweb-1.onrender.com/api/orders/getall',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          }
        );

        const formatted = res.data.map(order => ({
          ...order,
          address: order.address ?? '',
          city: order.city ?? '',
          zipCode: order.zipCode ?? '',
          phone: order.phone ?? order.user?.phone ?? '',
          items: order.items?.map(i => ({
            _id: i._id,
            item: i.item,
            quantity: i.quantity
          })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setOrders(formatted);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle order status update
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `https://foodiesweb-1.onrender.com/api/orders/update/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    );
  } catch (error) {
    alert(error.response?.data?.message || "Failed to update status");
  }
};


  if (loading) return (
    <div className={`${layoutClasses.page} flex items-center justify-center`}>
      <div className="text-amber-400 text-xl">Loading orders...</div>
    </div>
  );

  if (error) return (
    <div className={`${layoutClasses.page} flex items-center justify-center`}>
      <div className="text-amber-400 text-xl">{error}</div>
    </div>
  );

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>

          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {['Order ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status'].map(h => (
                    <th key={h} className={tableClasses.headerCell + (h === 'Total Items' ? ' text-center' : '')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {orders.map(order => {
                  const totalItems = order.items.reduce((t, i) => t + i.quantity, 0);
                  const totalPrice = order.total ?? order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);

                  const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                  const payStatusStyle = statusStyles[order.paymentStatus] || statusStyles.processing;
                  const stat = statusStyles[order.status] || statusStyles.processing;

                  return (
                    <tr key={order._id} className={tableClasses.row}>
                      {/* ID */}
                      <td className={`${tableClasses.cellBase} font-mono text-sm text-amber-100`}>
                        #{order._id.slice(-8)}
                      </td>

                      {/* CUSTOMER */}
                      <td className={tableClasses.cellBase}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-amber-400 text-lg" />
                            <span>{order.user?.name || `${order.firstName} ${order.lastName}`}</span>
                          </div>
                          <p className="text-sm text-amber-400/60">{order.phone}</p>
                          <p className="text-sm text-amber-400/60">{order.user?.email || order.email}</p>
                        </div>
                      </td>

                      {/* ADDRESS */}
                      <td className={tableClasses.cellBase}>
                        <div className="text-amber-100/50 text-sm max-w-[200px]">
                          {order.address}, {order.city} - {order.zipCode}
                        </div>
                      </td>

                      {/* ITEMS */}
                      <td className={tableClasses.cellBase}>
                        <div className="space-y-1 max-h-52 overflow-auto">
                          {order.items.map((itm, idx) => (
                            <div key={idx} className="flex items-center gap-3 rounded-lg">
                              <img
                                src={`https://foodiesweb-1.onrender.com/${itm.item.imageUrl}`}
                                alt={itm.item.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <span className="text-amber-100/80 text-sm block truncate">
                                  {itm.item.name}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                  <span>₹{itm.item.price.toFixed(2)}</span>
                                  <span>&dot;</span>
                                  <span>x{itm.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* TOTAL ITEMS */}
                      <td className={tableClasses.cellBase + ' text-center'}>
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-amber-400" />
                          <span className="text-amber-300 text-lg">{totalItems}</span>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className={tableClasses.cellBase + ' text-amber-300 text-lg'}>
                        ₹{totalPrice.toFixed(2)}
                      </td>

                      {/* PAYMENT */}
                      <td className={tableClasses.cellBase}>
                        <div className="flex flex-col gap-2">
                          <div className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                            {payMethod.label}
                          </div>
                          <div className={`${payStatusStyle.color} flex items-center gap-2 text-sm`}>
                            {iconMap[payStatusStyle.icon]}
                            <span>{payStatusStyle.label}</span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <span className={`${stat.color} text-xl`}>{iconMap[stat.icon]}</span>
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order._id, e.target.value)}
                            className={`px-4 py-2 rounded-lg ${stat.bg} ${stat.color} border border-amber-500/20 text-sm cursor-pointer`}
                          >
                            {Object.entries(statusStyles)
                              .filter(([key]) => key !== 'succeeded')
                              .map(([key, style]) => (
                                <option key={key} value={key} className={`${style.bg} ${style.color}`}>
                                  {style.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12 text-amber-100/60 text-xl">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
