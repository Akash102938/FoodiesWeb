import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiBox, FiCheckCircle, FiClock, FiMapPin, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import fallbackImage from '../../assets/AboutImage.png';

function MyOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://foodiesweb-1.onrender.com/api/orders', {
                    params: { email: user?.email },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                const formattedOrders = response.data.map(order => ({
                    ...order,
                    items: order.items?.map(entry => ({
                        _id: entry._id,
                        item: {
                            ...entry.item,
                            imageUrl: entry.item.imageUrl
                        },
                        quantity: entry.quantity
                    })) || [],
                    createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    paymentStatus: order.paymentStatus?.toLowerCase() || 'pending'
                }));

                setOrders(formattedOrders);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load orders. Try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.email]);

    // Status Styling
    const statusStyles = {
        processing: {
            color: 'text-amber-400',
            bg: 'bg-amber-900/20',
            icon: <FiClock className="text-lg" />,
            label: 'Processing'
        },
        outForDelivery: {
            color: 'text-blue-400',
            bg: 'bg-blue-900/20',
            icon: <FiTruck className="text-lg" />,
            label: 'Out for Delivery'
        },
        delivered: {
            color: 'text-green-400',
            bg: 'bg-green-900/20',
            icon: <FiCheckCircle className="text-lg" />,
            label: 'Delivered'
        },
        pending: {
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/20',
            icon: <FiClock className="text-lg" />,
            label: 'Payment Pending'
        },
        succeeded: {
            color: 'text-green-400',
            bg: 'bg-green-900/20',
            icon: <FiCheckCircle className="text-lg" />,
            label: 'Completed'
        }
    };

    const getPaymentMethodDetails = (method) => {
        switch (method?.toLowerCase()) {
            case 'cod':
                return { label: 'Cash on Delivery', class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50' };
            case 'card':
                return { label: 'Credit/Debit Card', class: 'bg-blue-600/30 text-blue-300 border-blue-500/50' };
            case 'upi':
                return { label: 'UPI Payment', class: 'bg-purple-600/30 text-purple-300 border-purple-500/50' };
            default:
                return { label: 'Online Payment', class: 'bg-green-600/30 text-green-400 border-green-500/50' };
        }
    };

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 text-amber-400 hover:text-amber-300 flex items-center gap-2"
                >
                    <FiArrowLeft /> Try Again
                </button>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3a2b1d] py-12 px-4">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                        <FiArrowLeft className="text-xl" /> Back to Home
                    </Link>
                    <span className="text-amber-400/70 text-sm">{user?.email}</span>
                </div>

                {/* Table */}
                <div className="bg-[#4b3b3b]/80 rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20">
                    <h2 className="text-3xl font-bold mb-8 text-center text-amber-300">Order History</h2>

                {loading && (
                    <div className="text-center py-12 text-amber-100/60 text-xl">
                        Loading orders...
                    </div>
                )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#3a2b2b]/50">
                                <tr>
                                    <th className="p-4 text-left text-amber-400">Order ID</th>
                                    <th className="p-4 text-left text-amber-400">Customer</th>
                                    <th className="p-4 text-left text-amber-400">Address</th>
                                    <th className="p-4 text-left text-amber-400">Items</th>
                                    <th className="p-4 text-left text-amber-400">Total Items</th>
                                    <th className="p-4 text-left text-amber-400">Price</th>
                                    <th className="p-4 text-left text-amber-400">Payment</th>
                                    <th className="p-4 text-left text-amber-400">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map(order => {
                                    const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                                    const totalPrice = order.total ?? order.items.reduce(
                                        (sum, i) => sum + i.item.price * i.quantity,
                                        0
                                    );

                                    const paymentMethod = getPaymentMethodDetails(order.paymentMethod);
                                    const paymentStatus = statusStyles[order.paymentStatus] || statusStyles.pending;
                                    const status = statusStyles[order.status] || statusStyles.processing;

                                    return (
                                        <tr key={order._id} className="border-b border-amber-500/20 hover:bg-[#3a2b2b]/30">

                                            {/* Order ID */}
                                            <td className="p-4 text-amber-100 font-mono text-sm">
                                                #{order._id.slice(-8)}
                                            </td>

                                            {/* Customer */}
                                            <td className="p-4 text-amber-100/80">{order.name}</td>

                                            {/* Address */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-amber-100/80 text-sm">
                                                    <FiMapPin className="text-amber-400" />
                                                    {order.address}, {order.city}, {order.zipCode}
                                                </div>
                                            </td>

                                            {/* Items List */}
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    {order.items.map((entry, index) => (
                                                        <div key={entry._id || index} className="flex items-center gap-3 p-2 bg-[#3a2b2b]/50 rounded-lg">
                                                            <img
                                                                src={
                                                                    entry.item.imageUrl?.startsWith('http')
                                                                        ? entry.item.imageUrl
                                                                        : entry.item.imageUrl
                                                                            ? `https://foodiesweb-1.onrender.com${
                                                                                entry.item.imageUrl.startsWith('/')
                                                                                    ? entry.item.imageUrl
                                                                                    : `/uploads/${entry.item.imageUrl}`
                                                                                }`
                                                                            : fallbackImage
                                                                }
                                                                alt={entry.item.name}
                                                                onError={e => (e.currentTarget.src = fallbackImage)}
                                                                className="w-10 h-10 object-cover rounded-lg"
                                                            />
                                                            <div className="flex-1">
                                                                <span className="text-amber-100 text-sm">{entry.item.name}</span>
                                                                <div className="text-xs text-amber-400/70 flex gap-2">
                                                                    ₹{entry.item.price} x {entry.quantity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Total Items */}
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-amber-300">
                                                    <FiBox className="text-amber-400" />
                                                    {totalItems}
                                                </div>
                                            </td>

                                            {/* Total Price */}
                                            <td className="p-4 text-amber-300 text-lg">₹{totalPrice.toFixed(2)}</td>

                                            {/* Payment Method & Status */}
                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className={`${paymentMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                                                        {paymentMethod.label}
                                                    </div>

                                                    <div className={`${paymentStatus.bg} ${paymentStatus.color} flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm`}>
                                                        {paymentStatus.icon}
                                                        <span>{paymentStatus.label}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Order Status */}
                                            <td className="p-4">
                                                <div className={`${status.bg} ${status.color} px-3 py-1.5 rounded-lg flex items-center gap-2`}>
                                                    {status.icon} <span>{status.label}</span>
                                                </div>
                                            </td>
                                            
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                   
                   {orders.length === 0 && (
                    <div className='text-center py-12 text-amber-100/60 text-xl'>
                       No Orders Found
                    </div>
                   )}
                </div>
            </div>
        </div>
    );
}

export default MyOrder;
