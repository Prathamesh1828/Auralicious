import React, { useState, useRef } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = ({ onMenuToggle }) => {
  const [profileImage, setProfileImage] = useState(localStorage.getItem('adminProfileImage') || assets.profile_image)
  const fileInputRef = useRef(null)

  const handleProfileClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        localStorage.setItem('adminProfileImage', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <div className="hamburger-menu" onClick={onMenuToggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div>
          <h1 className="navbar-logo-text">AURALICIOUS</h1>
          <span className="navbar-subtitle">Admin Panel</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="profile-container" onClick={handleProfileClick}>
          <img className='profile' src={profileImage} alt="Admin Profile" />
          <div className="profile-overlay">
            <span>📷</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{display: 'none'}}
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar
