import React from "react";
import "./OrderTracking.css";

const OrderTracking = ({ order, onClose }) => {
  // Define order stages
  const stages = [
    {
      status: "Food Processing",
      icon: "🍳",
      description: "Your order is being prepared",
      completed: true,
    },
    {
      status: "Out for delivery",
      icon: "🚚",
      description: "Your order is on the way",
      completed: order.status === "Out for delivery" || order.status === "Delivered",
    },
    {
      status: "Delivered",
      icon: "✅",
      description: "Order delivered successfully",
      completed: order.status === "Delivered",
    },
  ];

  // Get current stage index
  const getCurrentStageIndex = () => {
    if (order.status === "Delivered") return 2;
    if (order.status === "Out for delivery") return 1;
    return 0;
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="order-tracking-overlay" onClick={onClose}>
      <div className="order-tracking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tracking-header">
          <h2>Track Your Order</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tracking-order-info">
          <div className="tracking-order-id">
            <strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}
          </div>
          <div className="tracking-order-date">
            <strong>Placed on:</strong>{" "}
            {new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="tracking-timeline">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`tracking-stage ${
                index <= currentStageIndex ? "completed" : "pending"
              } ${index === currentStageIndex ? "current" : ""}`}
            >
              <div className="stage-icon-container">
                <div className="stage-icon">{stage.icon}</div>
                {index < stages.length - 1 && (
                  <div
                    className={`stage-line ${
                      index < currentStageIndex ? "completed" : ""
                    }`}
                  ></div>
                )}
              </div>
              <div className="stage-content">
                <h3>{stage.status}</h3>
                <p>{stage.description}</p>
                {index === currentStageIndex && (
                  <span className="current-badge">Current Status</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="tracking-details">
          <div className="tracking-section">
            <h4>Delivery Address</h4>
            <p>
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state} - {order.address.zipcode}
            </p>
            <p>Phone: {order.address.phone}</p>
          </div>

          <div className="tracking-section">
            <h4>Order Items</h4>
            <div className="tracking-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="tracking-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="tracking-total">
              <strong>Total:</strong>
              <strong>₹{order.amount}</strong>
            </div>
          </div>

          <div className="tracking-section">
            <h4>Payment Details</h4>
            <p>
              <strong>Method:</strong>{" "}
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={order.payment ? "paid-status" : "pending-status"}>
                {order.payment ? "Paid" : "Pending"}
              </span>
            </p>
          </div>
        </div>

        <div className="tracking-footer">
          {order.status !== "Delivered" && (
            <div className="estimated-time">
              <p>
                <strong>Estimated Delivery:</strong> 30-45 minutes
              </p>
            </div>
          )}
          <button className="close-tracking-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
