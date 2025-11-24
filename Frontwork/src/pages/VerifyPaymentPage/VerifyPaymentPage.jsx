import React from 'react'
import { useCart } from '../../CartContext/CartContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function VerifyPaymentPage() {
  const {clearCart} = useCart();
  const {search} = useLocation();
  const navigate = useNavigate();
  const [statusMsg,setStatusMsg] = useState('Verifying Payment....')

  const token = localStorage.getItem('authToken');
  const authHeaders = token ? {Authorization: `Bearer ${token}` }:{};

  useEffect(()=>{
    const params = new URLSearchParams(search)
    const success = params.get('success')
    const session_id = params.get('session_id')

    console.log('VerifyPaymentPage - success:', success, 'session_id:', session_id);

    //MISSING OR CANCELLED
    if(success !== 'true' || !session_id){
      if(success === 'false'){
        setStatusMsg('Payment cancelled. Redirecting to checkout...')
        setTimeout(() => navigate('/checkout', {replace: true}), 2000)
        return;
      }
      setStatusMsg('Invalid or missing payment details. Please try again.')
      return
    }

    //STRIPE SUCCESS TRUE
    axios.get('https://foodiesweb-1.onrender.com/api/orders/confirm',{
      params: {session_id},
      headers: authHeaders
    })
    .then((res)=>{
      console.log('Payment confirmed:', res.data);
      clearCart();
      setTimeout(() => navigate('/myorder', {replace: true}), 1000)
    })
    .catch(err =>{
      console.error('Confirmation error:', err);
      setStatusMsg(`Payment confirmed but order confirmation failed. Error: ${err.response?.data?.message || err.message}`)
    })
  },[search, clearCart, navigate, authHeaders])
 return (
     
    <div className='min-h-screen flex items-center justify-center text-white'>
        <p>{statusMsg}</p>
    </div>
  )
}

export default VerifyPaymentPage