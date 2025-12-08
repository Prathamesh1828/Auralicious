import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';


const NavBar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(localStorage.getItem('userProfileImage') || null);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Update profile image when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserProfileImage(localStorage.getItem('userProfileImage'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for changes in the same tab
    const interval = setInterval(() => {
      const newImage = localStorage.getItem('userProfileImage');
      if (newImage !== userProfileImage) {
        setUserProfileImage(newImage);
      }
    }, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userProfileImage]);


  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };


  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchPopup(false);
    }
  };


  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Remove trailing punctuation marks (period, comma, question mark, exclamation)
      const cleanedTranscript = transcript.replace(/[.,!?]+$/, '').trim();
      setSearchQuery(cleanedTranscript);
      navigate(`/search?q=${encodeURIComponent(cleanedTranscript)}`);
      setShowSearchPopup(false);
    };
    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const menuSection = document.getElementById('explore-menu');
      const appSection = document.getElementById('app-download');
      const contactSection = document.getElementById('footer');


      if (scrollY < 100) {
        setMenu('Home');
      } else if (menuSection && scrollY >= menuSection.offsetTop - 150 && scrollY < appSection.offsetTop - 150) {
        setMenu('Menu');
      } else if (appSection && scrollY >= appSection.offsetTop - 150 && scrollY < contactSection.offsetTop - 150) {
        setMenu('Mobile-App');
      } else if (contactSection && scrollY >= contactSection.offsetTop - 150) {
        setMenu('Contact Us');
      }
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const closeMobileMenu = () => setMobileMenuOpen(false);


  return (
    <div className="navbar">
      <Link to="/" className="logo">
        <img src={assets.logo} alt="Logo" />
      </Link>


      <ul className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => { setMenu('Home'); closeMobileMenu(); }} className={menu === 'Home' ? 'active' : ''}>Home</Link>
        <a href="#explore-menu" onClick={() => { setMenu('Menu'); closeMobileMenu(); }} className={menu === 'Menu' ? 'active' : ''}>Menu</a>
        <a href="#app-download" onClick={() => { setMenu('Mobile-App'); closeMobileMenu(); }} className={menu === 'Mobile-App' ? 'active' : ''}>Mobile-App</a>
        <a href="#footer" onClick={() => { setMenu('Contact Us'); closeMobileMenu(); }} className={menu === 'Contact Us' ? 'active' : ''}>Contact Us</a>
      </ul>


      <div className="navbar-right">
        {/* Desktop search bar */}
        <div className="navbar-search">
          <button className="search-icon-btn" onClick={handleSearch}>
            <img src={assets.search_icon} alt="Search" />
          </button>
          <input
            type="text"
            placeholder="Search food..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="voice-icon-btn" onClick={handleVoiceSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor" />
              <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.92V22H13V18.92C16.39 18.43 19 15.53 19 12H17Z" fill="currentColor" />
            </svg>
          </button>
        </div>


        {/* Search icon only for small devices */}
        <div className="navbar-search-icon-only" onClick={() => setShowSearchPopup(true)}>
          <img src={assets.search_icon} alt="Search" />
        </div>


        <div className="navbar-search-icon" onClick={() => !token ? setShowLogin(true) : navigate('/cart')}>
          <img src={assets.basket_icon} alt="Cart" style={{ cursor: "pointer" }} />
          <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
        </div>


        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={userProfileImage || assets.profile_icon} alt="Profile" className={userProfileImage ? 'user-profile-img' : ''} />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="Profile" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}


        {/* Hamburger icon */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>


      {/* Search Popup Modal */}
      {showSearchPopup && (
        <div className="search-popup">
          <div className="search-popup-content">
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <span className="close-popup" onClick={() => setShowSearchPopup(false)}>&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};


export default NavBar;
