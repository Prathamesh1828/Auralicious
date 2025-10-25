import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list")
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error("Error fetching orders")
      }
    } catch (error) {
      toast.error("Failed to fetch orders")
      console.error(error)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Order status updated")
      }
    } catch (error) {
      toast.error("Failed to update status")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className='orders-page'>
      <h2 className="orders-title">Order Management</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <img src={assets.parcel_icon} alt="No orders" />
            <p>No orders yet</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <div className="order-icon">
                <img src={assets.parcel_icon} alt="Parcel" />
              </div>
              <div className="order-details">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={`order-status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items">
                  <p className="items-list">
                    {order.items.map((item, idx) => {
                      if (idx === order.items.length - 1) {
                        return item.name + " x " + item.quantity
                      } else {
                        return item.name + " x " + item.quantity + ", "
                      }
                    })}
                  </p>
                </div>
                <div className="order-info">
                  <div className="info-group">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">{order.address.firstName} {order.address.lastName}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{order.address.phone}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Address:</span>
                    <span className="info-value">
                      {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}
                    </span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Items:</span>
                    <span className="info-value">{order.items.length} item(s)</span>
                  </div>
                </div>
                <div className="order-footer">
                  <div className="order-amount">
                    <span className="amount-label">Total Amount:</span>
                    <span className="amount-value">₹{order.amount}</span>
                  </div>
                  <select 
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={order.status}
                    className="status-select"
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
