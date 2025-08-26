import { useState, useEffect } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import About from './pages/About/About'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase'
import { getRedirectResult } from 'firebase/auth'
import { toast } from 'react-toastify'

const App = () => {

  const [showLogin,setShowLogin] = useState(false);

  // Handle Google Sign-In redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email);
          toast.success("Google sign-in successful!");
          // The StoreContext will handle the rest of the authentication flow
        }
      } catch (error) {
        console.error('Redirect sign-in error:', error);
        toast.error(`Sign-in failed: ${error.message}`);
      }
    };

    handleRedirectResult();
  }, []);

  return (
    <>
    <ToastContainer/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/order' element={<PlaceOrder />}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/about' element={<About />}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
