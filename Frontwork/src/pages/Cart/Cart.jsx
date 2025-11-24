import React,{useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import CartPage from '../../components/CartPage/CartPage'
function Cart() {
    useEffect(()=>{
      window.scrollTo(0,0);
    },[]);
  return (
    <div>
      <Navbar/>
      <CartPage/>
      <Footer/>
    </div>
  )
}

export default Cart