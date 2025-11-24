import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import About from '../../components/About/About'
import { useEffect } from 'react'
function AboutPage() {
  useEffect(()=>{
    window.scrollTo(0,0);
  },[]);
  return (
    <div>
      <Navbar/>
      <About/>
      <Footer/>
    </div>
  )
}

export default AboutPage