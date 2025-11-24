import React ,{useEffect}from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Contact from '../../components/Contact/Contact'
function ContactPage() {
    useEffect(()=>{
      window.scrollTo(0,0);
    },[]);
  return (
    <div>
      <Navbar/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default ContactPage