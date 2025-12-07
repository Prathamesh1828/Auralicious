import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";


import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import OrderTracking from "../../components/OrderTracking/OrderTracking";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Fetched Orders:", response.data.data);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My Orders</h2>
        <button onClick={fetchOrders} className="refresh-btn">
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <a href="/" className="browse-link">Browse Menu</a>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <span className="order-date">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <div className="items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img src={url + "/images/" + item.image} alt={item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <p className="item-price">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="delivery-address">
                  <h4>Delivery Address:</h4>
                  <p>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state} - {order.address.zipcode}
                  </p>
                  <p>Phone: {order.address.phone}</p>
                </div>

                <div className="order-summary">
                  <div className="payment-method">
                    <strong>Payment:</strong>{" "}
                    <span className={`payment-badge ${order.paymentMethod}`}>
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                  <div className="payment-status">
                    <strong>Payment Status:</strong>{" "}
                    <span className={order.payment ? "paid" : "pending"}>
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="order-total">
                    <strong>Total Amount:</strong> <span>₹{order.amount}</span>
                  </div>
                </div>
              </div>

              <div className="order-actions">
                <button
                  className="track-order-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  Track Order
                </button>
                {!order.payment && order.paymentMethod === "cod" && (
                  <button className="help-btn">Need Help?</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <OrderTracking
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
