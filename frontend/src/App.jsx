import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import  Collections from './pages/Collections';
import AboutPage from './pages/About';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Order from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import Products from './pages/Products';
import NavBar from './components/NavBar';


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <NavBar/>

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collections' element={<Collections/>} />
        
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/cart' element={<Cart/>} />
        
        <Route path='/contact' element={<Contact/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/order' element={<Order/>} />
        <Route path='/placeorder' element={<PlaceOrder/>} />
        <Route path='/products/:productId' element={<Products/>} />






      </Routes>
       






    </div>
  )
}

export default App