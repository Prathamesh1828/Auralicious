import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default payment method

  // Check if user is logged in and has items in cart
  useEffect(() => {
    if (!token) {
      alert("Please login to place an order");
      navigate("/");
    } else if (getTotalCartAmount() === 0) {
      alert("Your cart is empty");
      navigate("/cart");
    }
  }, [token, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    console.log("=== PLACE ORDER FUNCTION CALLED ===");
    console.log("Payment Method Selected:", paymentMethod);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Cart Total:", getTotalCartAmount());
    
    // Check if user is logged in
    if (!token) {
      alert("Please login to place an order");
      setLoading(false);
      return;
    }
    
    // Check if cart is empty
    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log("Loading state set to true");
    
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    console.log("Order Items:", orderItems);

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 50,
      paymentMethod: paymentMethod,
    };

    try {
      console.log("=== SENDING ORDER TO BACKEND ===");
      console.log("Order Data:", orderData);
      console.log("Backend URL:", url);
      
      let response = await axios.post(url + "/api/order/place", orderData, { 
        headers: { token } 
      });
      
      console.log("=== BACKEND RESPONSE RECEIVED ===");
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
      
      if (response.data.success) {
        // Handle Cash on Delivery
        if (paymentMethod === "cod") {
          alert("Order placed successfully! Pay on delivery.");
          navigate("/myorders");
          setLoading(false);
          return;
        }
        
        // Handle Razorpay payment
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded. Please refresh the page and try again.");
          setLoading(false);
          return;
        }

        const options = {
          key: response.data.key, // Razorpay Key ID from backend
          amount: response.data.amount, // Amount in paisa
          currency: response.data.currency,
          name: "Tomato Food Delivery",
          description: "Order Payment",
          image: "/logo.png", // Your logo URL
          order_id: response.data.order_id, // Razorpay order ID from backend
          handler: async function (razorpayResponse) {
            console.log("Payment Success Response:", razorpayResponse);
            console.log("Razorpay Order ID:", razorpayResponse.razorpay_order_id);
            console.log("Razorpay Payment ID:", razorpayResponse.razorpay_payment_id);
            console.log("Razorpay Signature:", razorpayResponse.razorpay_signature);
            
            // Verify payment signature on backend
            try {
              const verifyResponse = await axios.post(
                url + "/api/order/verify",
                {
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature
                },
                { headers: { token } }
              );
              
              console.log("Verification Response:", verifyResponse.data);
              
              if (verifyResponse.data.success) {
                alert("Payment successful! Your order has been placed.");
                navigate("/myorders"); // Navigate to orders page
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Verification error:", error);
              alert("Payment verification failed. Please contact support with your payment ID: " + razorpayResponse.razorpay_payment_id);
            }
            setLoading(false);
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          notes: {
            address: `${data.street}, ${data.city}, ${data.state}`,
            orderId: response.data.orderId // Store our internal order ID
          },
          theme: {
            color: "#ff6b35"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              console.log('Checkout form closed by user');
              alert("Payment cancelled. Your order has been saved but not confirmed.");
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (errorResponse) {
          console.error("Payment failed:", errorResponse.error);
          alert(`Payment failed: ${errorResponse.error.description}\nReason: ${errorResponse.error.reason}`);
          setLoading(false);
        });
        
        razorpay.open();
      } else {
        alert("Error creating order: " + (response.data.message || "Unknown error"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response) {
        // Server responded with error
        alert(`Error: ${error.response.data.message || "Failed to place order"}`);
      } else if (error.request) {
        // Request made but no response
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        alert("Error placing order. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input 
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text" 
            placeholder="First Name" 
          />
          <input 
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text" 
            placeholder="Last Name" 
          />
        </div>
        <input 
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email" 
          placeholder="Email Address" 
        />
        <input 
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text" 
          placeholder="Street" 
        />
        <div className="multi-fields">
          <input 
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text" 
            placeholder="City" 
          />
          <input 
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text" 
            placeholder="State" 
          />
        </div>
        <div className="multi-fields">
          <input 
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text" 
            placeholder="Zip Code" 
          />
          <input 
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text" 
            placeholder="Country" 
          />
        </div>
        <input 
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="tel" 
          placeholder="Phone" 
        />
        
        {/* Refund & Return Policy */}
        <div className="refund-policy">
          <h3>Refund & Return Policy</h3>
          <div className="policy-content">
            <div className="policy-section">
              <h4>1. No Returns on Delivered Food</h4>
              <p>Since our products are perishable, we do not accept returns once the order has been delivered. However, if there is a problem with your order, we'll make it right through refund or replacement as applicable.</p>
            </div>
            
            <div className="policy-section">
              <h4>2. Refund Eligibility</h4>
              <p>You may be eligible for a refund or replacement in the following cases:</p>
              <ul>
                <li>The order was not delivered</li>
                <li>The food was incorrect (items missing or wrong order received)</li>
                <li>The food was stale, spoiled, or damaged upon arrival</li>
                <li>You were charged incorrectly due to a technical issue</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h4>3. Non-Refundable Situations</h4>
              <p>Refunds are not applicable in the following cases:</p>
              <ul>
                <li>You changed your mind after placing the order</li>
                <li>You provided an incorrect address or were unavailable to receive the order</li>
                <li>Delays caused by external factors (traffic, weather, festivals, etc.)</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h4>4. Cancellation and Refund Timeline</h4>
              <ul>
                <li>Orders can be canceled within 2 minutes of placing them (before preparation starts)</li>
                <li>Once food preparation begins, cancellation may not be possible</li>
                <li>Approved refunds will be processed within 3-5 business days to your original payment method</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h4>5. How to Request a Refund</h4>
              <p>To request a refund or report an issue:</p>
              <ul>
                <li>Contact our support team within 30 minutes of delivery</li>
                <li>Share your order ID, issue details, and a photo (if applicable)</li>
                <li>Our team will review and respond promptly</li>
              </ul>
              <p className="contact-info">
                <strong>Email:</strong> support@tomato.com<br/>
                <strong>Phone:</strong> +91 98765 43210
              </p>
            </div>
            
            <div className="policy-section">
              <h4>6. Our Commitment</h4>
              <p>We take customer satisfaction seriously and always aim to resolve issues fairly. Thank you for trusting us for your food delivery needs!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b>
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <div className="payment-method-selector">
            <h3>Choose Payment Method</h3>
            <div className="payment-options">
              
              {/* Cash on Delivery */}
              <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <div className="payment-details">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive</p>
                    <span className="recommended-badge">RECOMMENDED</span>
                  </div>
                </div>
                {paymentMethod === "cod" && (
                  <div className="checkmark">✓</div>
                )}
              </label>
              
              {/* Razorpay */}
              <label className={`payment-option ${paymentMethod === "razorpay" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <div className="payment-details">
                    <strong>Online Payment</strong>
                    <p>UPI, Cards, Wallets & More</p>
                    <div className="payment-logos">
                      <span className="mini-logo">UPI</span>
                      <span className="mini-logo">Card</span>
                      <span className="mini-logo">Wallet</span>
                    </div>
                  </div>
                </div>
                {paymentMethod === "razorpay" && (
                  <div className="checkmark">✓</div>
                )}
              </label>
              
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || getTotalCartAmount() === 0}
            className={loading ? "loading" : ""}
          >
            {loading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
          
          {/* Razorpay Trust Badge */}
          <div className="payment-trust-badge">
            <div className="trust-badge-content">
              <svg className="lock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7Z" fill="#4CAF50"/>
              </svg>
              <div className="trust-text">
                <span className="secure-text">100% Secure Payments</span>
                <span className="powered-text">Powered by Razorpay</span>
              </div>
            </div>
            <div className="payment-methods-icons">
              <span className="method-icon">VISA</span>
              <span className="method-icon">MC</span>
              <span className="method-icon">UPI</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
