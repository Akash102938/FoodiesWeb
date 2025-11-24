import React,{useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import OurMenu from '../../components/OurMenu.jsx/OurMenu'
function Menu() {
    useEffect(()=>{
      window.scrollTo(0,0);
    },[]);
  return (
    <div>
      <Navbar/>
      <OurMenu/>
      <Footer/>
    </div>
  )
}

export default Menu