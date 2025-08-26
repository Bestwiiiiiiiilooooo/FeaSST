import './Cart.css'
import { useContext, useState } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency, clearCart} = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  const checkPromo = () => {
    // Find if any item in the cart has a matching promoCode
    const hasValidPromo = food_list.some(item => {
      // Check if this item exists in cart (with or without side dishes)
      const itemInCart = Object.entries(cartItems).some(([cartKey, quantity]) => {
        const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
        return itemId === item._id && quantity > 0;
      });
      
      return itemInCart && item.promoCode && 
             item.promoCode.trim().toLowerCase() === promoInput.trim().toLowerCase();
    });
    setPromoStatus(hasValidPromo ? "Valid" : "Not valid");
    
    // Store promo code information in localStorage if valid
    if (hasValidPromo) {
      const promoInfo = {
        code: promoInput.trim(),
        appliedAt: new Date().toISOString()
      };
      localStorage.setItem('appliedPromoCode', JSON.stringify(promoInfo));
    } else {
      localStorage.removeItem('appliedPromoCode');
    }
  };

  // Calculate promo discount if valid
  let promoDiscountAmount = 0;
  if (promoStatus === 'Valid') {
    // Find all items in cart with matching promo code
    const matchingItems = food_list.filter(item => {
      // Check if this item exists in cart (with or without side dishes)
      const itemInCart = Object.entries(cartItems).some(([cartKey, quantity]) => {
        const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
        return itemId === item._id && quantity > 0;
      });
      
      return itemInCart && item.promoCode && 
             item.promoCode.trim().toLowerCase() === promoInput.trim().toLowerCase();
    });
    
    // Apply the highest discount among matching items
    promoDiscountAmount = Math.max(...matchingItems.map(item => {
      // Calculate total for this item including all cart entries (with side dishes)
      let itemTotal = 0;
      Object.entries(cartItems).forEach(([cartKey, quantity]) => {
        const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
        if (itemId === item._id && quantity > 0) {
          let entryTotal = item.price;
          
          // Add side dishes price if present
          if (cartKey.includes('_')) {
            try {
              // Find the first underscore and get everything after it
              const underscoreIndex = cartKey.indexOf('_');
              const encodedSideDishes = cartKey.substring(underscoreIndex + 1);
              const sideDishesJson = atob(encodedSideDishes); // Base64 decode
              const sideDishes = JSON.parse(sideDishesJson);
              const sideDishesTotal = sideDishes.reduce((sum, sd) => sum + sd.price, 0);
              entryTotal += sideDishesTotal;
            } catch (e) {
              console.error('Error parsing side dishes:', e);
            }
          }
          
          itemTotal += entryTotal * quantity;
        }
      });
      
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
          // Find all cart entries for this item (with different side dishes)
          const itemCartEntries = Object.entries(cartItems).filter(([cartKey, quantity]) => {
            const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
            return itemId === item._id && quantity > 0;
          });

          return itemCartEntries.map(([cartKey, quantity], entryIndex) => {
            let sideDishes = [];
            let itemTotal = item.price;
            
            // Parse side dishes if present
            if (cartKey.includes('_')) {
              try {
                // Find the first underscore and get everything after it
                const underscoreIndex = cartKey.indexOf('_');
                const encodedSideDishes = cartKey.substring(underscoreIndex + 1);
                const sideDishesJson = atob(encodedSideDishes); // Base64 decode
                sideDishes = JSON.parse(sideDishesJson);
                const sideDishesTotal = sideDishes.reduce((sum, sd) => sum + sd.price, 0);
                itemTotal += sideDishesTotal;
              } catch (e) {
                console.error('Error parsing side dishes:', e);
                console.error('CartKey:', cartKey);
                console.error('Attempted to parse:', cartKey.split('_')[1]);
              }
            }

            return (
              <div key={`${index}-${entryIndex}`}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    {sideDishes.length > 0 && (
                      <div className="side-dishes-list">
                        {sideDishes.map((sd, sdIndex) => (
                          <span key={sdIndex} className="side-dish-tag">
                            {sd.name} (+{currency}{Number(sd.price).toFixed(2)})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p>{currency}{Number(item.price).toFixed(2)}</p>
                  <div>{quantity}</div>
                  <p>{currency}{Number(itemTotal * quantity).toFixed(2)}</p>
                  <p className='cart-items-remove-icon' onClick={()=>removeFromCart(cartKey)}>x</p>
                </div>
                <hr />
              </div>
            );
          });
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{Number(subtotal).toFixed(2)}</p></div>
            <hr />
            {promoStatus === 'Valid' && promoDiscountAmount > 0 && (
              <div className="cart-total-details" style={{color: 'green'}}>
                <p>Promo Discount</p>
                <p>-{currency}{promoDiscountAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="cart-total-details"><b>Total</b><b>{currency}{Number(total).toFixed(2)}</b></div>
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
