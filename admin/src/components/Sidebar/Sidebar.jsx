import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-options">
          <NavLink to='/add' className="side-option" onClick={onClose}>
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
          </NavLink>
          <NavLink to='/list' className="side-option" onClick={onClose}>
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
          </NavLink>
          <NavLink to='/orders' className="side-option" onClick={onClose}>
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar
