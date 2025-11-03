import {Route, Routes} from 'react-router-dom'
import React from 'react'
import Home from './pages/Home/Home'
import ContactPage from './pages/ContactPage/ContactPage'
import AboutPage from './pages//AboutPage/AboutPage'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import SignUp from './components/SignUp/SignUp'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'


function App() {
  return (
    <>
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/menu' element={<Menu/>}/>
     
        <Route path='/login' element={<Home/>}/>
        <Route path='/signup' element = {<SignUp/>} />

        <Route path='/cart' element={
          <PrivateRoute>
            <Cart/>
          </PrivateRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
