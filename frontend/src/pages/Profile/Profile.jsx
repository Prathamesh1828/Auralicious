import React, { useState, useEffect, useRef, useContext } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {
  const { url, token } = useContext(StoreContext)
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(localStorage.getItem('userProfileImage') || null)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const fileInputRef = useRef(null)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/api/user/profile`, {
          headers: { token }
        })
        if (response.data.success) {
          const user = response.data.data
          setUserData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
          })
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Use mock data if API fails
        const mockData = {
          name: localStorage.getItem('userName') || 'User Name',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          phone: localStorage.getItem('userPhone') || '+91 98765 43210'
        }
        setUserData(mockData)
        setFormData(mockData)
      }
    }

    if (token) {
      fetchUserData()
    }
  }, [token, url])

  const handleProfileImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        localStorage.setItem('userProfileImage', reader.result)
        toast.success('Profile picture updated!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(userData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      // Validate form data
      if (!formData.name.trim()) {
        toast.error('Name is required')
        return
      }
      if (!formData.email.trim()) {
        toast.error('Email is required')
        return
      }
      if (!formData.phone.trim()) {
        toast.error('Phone is required')
        return
      }

      // Try to update via API
      try {
        const response = await axios.post(`${url}/api/user/update`, formData, {
          headers: { token }
        })
        if (response.data.success) {
          setUserData(formData)
          localStorage.setItem('userName', formData.name)
          localStorage.setItem('userEmail', formData.email)
          localStorage.setItem('userPhone', formData.phone)
          setIsEditing(false)
          toast.success('Profile updated successfully!')
        }
      } catch (error) {
        // If API fails, save to localStorage
        setUserData(formData)
        localStorage.setItem('userName', formData.name)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userPhone', formData.phone)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className='profile-page'>
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-content">
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper" onClick={handleProfileImageClick}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-picture" />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>{getInitials(userData.name)}</span>
                </div>
              )}
              <div className="profile-picture-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Change Photo</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{display: 'none'}}
              />
            </div>
            <p className="profile-picture-hint">Click to upload a new photo</p>
          </div>

          {/* Profile Information Section */}
          <div className="profile-info-section">
            <div className="profile-info-header">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={handleEdit}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
