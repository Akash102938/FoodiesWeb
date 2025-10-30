import React, { useState } from 'react'
import { FaRegEnvelope } from "react-icons/fa";

function Footer() {
  const [email,setEmail] = useState('')
  const handleSubmit = (e)=>{
    e.prevenDefault();
    alert(`Thanks for subscribing We'll send updates to ${email}` );
    setEmail('')
  }
  return (
    <footer className='bg-[#2A211C] text-amber-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
         <div className='max-w-7xl mx-auto relative z-10 '>
              {/*LEFT COLUMN*/}
              <div className='space-y-6'>
                <h2 className='text-4xl sm:text-5xl md:text-5xl font-bold font-sacramento text-amber-400 animate-pulse'>
                    Foodie-Frenzy
                </h2>
                <p className='text-amber-200/90 text-sm font-sacramento italic'>
                   When Culniart artistry meets doorstep covenice. <br />
                   Savor handcrafted perfection, delivered with care.
                </p>

                <form onSubmit={handleSubmit} className='relative mt-4 group'>
                  <div className='flex items-center gap-2 mb-2'>
                    <FaRegEnvelope className='text-amber-400 animate-pulse' />
                  </div>
                </form>
              </div>
         </div>
    </footer>
  )
}

export default Footer