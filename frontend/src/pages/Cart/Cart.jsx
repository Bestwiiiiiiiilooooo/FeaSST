import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge, clearCart} = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  const checkPromo = () => {
    // Find if any item in the cart has a matching promoCode
    const hasValidPromo = food_list.some(item =>
      cartItems[item._id] > 0 &&
      item.promoCode &&
      item.promoCode.trim().toLowerCase() === promoInput.trim().toLowerCase()
    );
    setPromoStatus(hasValidPromo ? "Valid" : "Not valid");
  };

  // Calculate promo discount if valid
  let promoDiscountAmount = 0;
  if (promoStatus === 'Valid') {
    // Find all items in cart with matching promo code
    const matchingItems = food_list.filter(item =>
      cartItems[item._id] > 0 &&
      item.promoCode &&
      item.promoCode.trim().toLowerCase() === promoInput.trim().toLowerCase()
    );
    // Apply the highest discount among matching items
    promoDiscountAmount = Math.max(...matchingItems.map(item => {
      const itemTotal = item.price * cartItems[item._id];
      return item.promoDiscount ? (itemTotal * (item.promoDiscount / 100)) : 0;
    }), 0);
  }
  const subtotal = getTotalCartAmount();
  const total = Math.max(0, subtotal - promoDiscountAmount);

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>{currency}{item.price}</p>
                <div>{cartItems[item._id]}</div>
                <p>{currency}{item.price*cartItems[item._id]}</p>
                <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
              </div>
              <hr />
            </div>)
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{subtotal}</p></div>
            <hr />
            {promoStatus === 'Valid' && promoDiscountAmount > 0 && (
              <div className="cart-total-details" style={{color: 'green'}}>
                <p>Promo Discount</p>
                <p>-{currency}{promoDiscountAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="cart-total-details"><b>Total</b><b>{currency}{total}</b></div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
          <button className='cart-clear-btn' onClick={clearCart}>CLEAR CART</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder='promo code'
                value={promoInput}
                onChange={e => { setPromoInput(e.target.value); setPromoStatus(""); }}
              />
              <button type="button" onClick={checkPromo}>Submit</button>
            </div>
            {promoStatus && (
              <div style={{ marginTop: 6, color: promoStatus === 'Valid' ? 'green' : 'red' }}>{promoStatus}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
