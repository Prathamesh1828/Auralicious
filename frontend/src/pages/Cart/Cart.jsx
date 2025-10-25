import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  const navigate = useNavigate();

  // Copy promo code to input
  const copyPromoCode = (code) => {
    setPromoCode(code);
  };

  // Handle promo code application
  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (getTotalCartAmount() === 0) {
      setPromoMessage("Your cart is empty!");
      setDiscount(0);
      setFreeDelivery(false);
      setIsPromoApplied(false);
      return;
    }

    if (code === "") {
      setPromoMessage("Please enter a promo code");
      setDiscount(0);
      setFreeDelivery(false);
      setIsPromoApplied(false);
      return;
    }

    // WELCOME50: 50% off on cart total
    if (code === "WELCOME50") {
      const discountAmount = getTotalCartAmount() * 0.5;
      setDiscount(discountAmount);
      setFreeDelivery(false);
      setPromoMessage("🎉 WELCOME50 applied! You saved ₹" + discountAmount.toFixed(2) + " (50% off)");
      setIsPromoApplied(true);
      setAppliedPromoCode(code);
    } 
    // JUSTJOINED: ₹50 instant discount
    else if (code === "JUSTJOINED") {
      const discountAmount = 50;
      setDiscount(discountAmount);
      setFreeDelivery(false);
      setPromoMessage("🎉 JUSTJOINED applied! You saved ₹50 instantly!");
      setIsPromoApplied(true);
      setAppliedPromoCode(code);
    } 
    // EATNOW: Free delivery
    else if (code === "EATNOW") {
      setDiscount(0);
      setFreeDelivery(true);
      setPromoMessage("🎉 EATNOW applied! Free delivery on your first 3 orders!");
      setIsPromoApplied(true);
      setAppliedPromoCode(code);
    } 
    else {
      setPromoMessage("❌ Invalid promo code. Try: WELCOME50, JUSTJOINED, or EATNOW");
      setDiscount(0);
      setFreeDelivery(false);
      setIsPromoApplied(false);
      setAppliedPromoCode("");
    }
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    if (getTotalCartAmount() === 0) return 0;
    if (freeDelivery) return 0;
    return 50;
  };

  // Calculate final total
  const calculateFinalTotal = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) return 0;
    const deliveryFee = getDeliveryFee();
    return subtotal - discount + deliveryFee;
  };
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)} className="cross">X</p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details discount-row">
                  <p>Discount ({appliedPromoCode})</p>
                  <p className="discount-amount">-₹{discount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p className={freeDelivery ? "free-delivery" : ""}>
                {freeDelivery ? (
                  <>
                    <span style={{textDecoration: 'line-through', color: '#999'}}>₹50</span>
                    {" "}
                    <span style={{color: '#4caf50', fontWeight: '600'}}>FREE</span>
                  </>
                ) : (
                  `₹${getDeliveryFee()}`
                )}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{calculateFinalTotal().toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Have a promo code? Enter it here.</p>
            
            {!isPromoApplied && (
              <div className="available-promos">
                <p className="promo-hint-title">Available Promo Codes:</p>
                <div className="promo-hint">
                  <span 
                    className="promo-code-badge" 
                    onClick={() => copyPromoCode("WELCOME50")}
                    title="Click to use this code"
                  >
                    WELCOME50
                  </span>
                  <span className="promo-desc">50% off on cart total</span>
                </div>
                <div className="promo-hint">
                  <span 
                    className="promo-code-badge"
                    onClick={() => copyPromoCode("JUSTJOINED")}
                    title="Click to use this code"
                  >
                    JUSTJOINED
                  </span>
                  <span className="promo-desc">₹50 instant discount</span>
                </div>
                <div className="promo-hint">
                  <span 
                    className="promo-code-badge"
                    onClick={() => copyPromoCode("EATNOW")}
                    title="Click to use this code"
                  >
                    EATNOW
                  </span>
                  <span className="promo-desc">Free delivery</span>
                </div>
              </div>
            )}
            
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder="Enter promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                disabled={isPromoApplied}
              />
              <button onClick={applyPromoCode} disabled={isPromoApplied}>
                {isPromoApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {promoMessage && (
              <p className={`promo-message ${isPromoApplied ? 'success' : 'error'}`}>
                {promoMessage}
              </p>
            )}
            {isPromoApplied && (
              <button 
                className="remove-promo-btn"
                onClick={() => {
                  setPromoCode("");
                  setDiscount(0);
                  setFreeDelivery(false);
                  setPromoMessage("");
                  setIsPromoApplied(false);
                  setAppliedPromoCode("");
                }}
              >
                Remove Promo Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
