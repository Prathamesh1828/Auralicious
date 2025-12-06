import React, { useState, useEffect, useRef } from "react";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import SearchResults from "./pages/SearchResults/SearchResults";
import ScrollToTopButton from "./components/ScrollToTop/ScrollToTop";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Profile from "./pages/Profile/Profile";
import Lenis from "lenis";

import BackgroundController from "./components/BackgroundController/BackgroundController";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic easing for smooth stops
      direction: 'vertical', // Scroll direction
      gestureDirection: 'vertical', // Gesture direction
      smooth: true,
      smoothTouch: false, // Disable on touch devices to avoid conflicts
      touchMultiplier: 2,
      infinite: false,
    });

    // Request animation frame loop for Lenis
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // Function to scroll to top (can be used by ScrollToTopButton)
  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.5 });
    }
  };

  // Function to scroll to specific element (can be used for navigation)
  const scrollToElement = (selector) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(selector, { duration: 1.5 });
    }
  };

  return (
    <>
      <BackgroundController />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <NavBar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <Footer />
      <ScrollToTopButton scrollToTop={scrollToTop} />
      <ChatWidget />
    </>
  );
};

export default App;
