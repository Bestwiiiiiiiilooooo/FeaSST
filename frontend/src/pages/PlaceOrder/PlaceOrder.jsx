import { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [data, setData] = useState({
        name: "",
        class: "",
        secondaryLevel: "",
        email: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,currency,userId,firebaseUser,userEmail } = useContext(StoreContext);

    const navigate = useNavigate();

    const [orderDate, setOrderDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });

    const [collectionTime, setCollectionTime] = useState("12:00");

    // Get applied promo code from localStorage
    const [appliedPromoCode] = useState(() => {
        const stored = localStorage.getItem('appliedPromoCode');
        return stored ? JSON.parse(stored) : null;
    });

    // Calculate promo discount if valid
    const calculatePromoDiscount = () => {
        if (!appliedPromoCode) return 0;
        
        // Find all items in cart with matching promo code
        const matchingItems = food_list.filter(item => {
            // Check if this item exists in cart (with or without side dishes)
            const itemInCart = Object.entries(cartItems).some(([cartKey, quantity]) => {
                const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
                return itemId === item._id && quantity > 0;
            });
            
            return itemInCart && item.promoCode && 
                   item.promoCode.trim().toLowerCase() === appliedPromoCode.code.toLowerCase();
        });
        
        // Apply the highest discount among matching items
        const promoDiscountAmount = Math.max(...matchingItems.map(item => {
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

        return promoDiscountAmount;
    };

    const promoDiscountAmount = calculatePromoDiscount();
    const subtotal = getTotalCartAmount();
    const total = Math.max(0, subtotal - promoDiscountAmount);

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        
        // Process cart items with side dishes
        Object.entries(cartItems).forEach(([cartKey, quantity]) => {
            if (quantity > 0) {
                // Extract itemId from cartKey (remove side dishes part if present)
                const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
                const item = food_list.find(food => food._id === itemId);
                
                if (item) {
                    let itemInfo = { ...item };
                    itemInfo.quantity = quantity;
                    
                    // Parse side dishes if present
                    if (cartKey.includes('_')) {
                        try {
                            // Find the first underscore and get everything after it
                            const underscoreIndex = cartKey.indexOf('_');
                            const encodedSideDishes = cartKey.substring(underscoreIndex + 1);
                            const sideDishesJson = atob(encodedSideDishes); // Base64 decode
                            const sideDishes = JSON.parse(sideDishesJson);
                            itemInfo.sideDishes = sideDishes;
                            // Calculate total price including side dishes
                            const sideDishesTotal = sideDishes.reduce((sum, sd) => sum + sd.price, 0);
                            itemInfo.totalPrice = item.price + sideDishesTotal;
                        } catch (e) {
                            console.error('Error parsing side dishes:', e);
                            console.error('CartKey:', cartKey);
                            console.error('Attempted to parse:', cartKey.split('_')[1]);
                            itemInfo.totalPrice = item.price;
                        }
                    } else {
                        itemInfo.totalPrice = item.price;
                    }
                    
                    orderItems.push(itemInfo);
                }
            }
        });
        // Group items by store/category
        const itemsByStore = {};
        orderItems.forEach(item => {
            if (!itemsByStore[item.category]) itemsByStore[item.category] = [];
            itemsByStore[item.category].push(item);
        });
        // Place an order for each store
        const results = await Promise.all(Object.entries(itemsByStore).map(async ([store, items]) => {
            // Calculate store-specific discount
            const storeItemsTotal = items.reduce((sum, item) => sum + (item.totalPrice || item.price) * item.quantity, 0);
            const storeDiscount = storeItemsTotal > 0 ? (promoDiscountAmount * (storeItemsTotal / subtotal)) : 0;
            const storeFinalAmount = Math.max(0, storeItemsTotal - storeDiscount);
            
            const orderData = {
                userId,
                address: data,
                items,
                amount: storeFinalAmount,
                stallId: store,
                orderDate,
                collectionTime,
            };
            try {
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${token}` } });
                return { store, success: response.data.success, message: response.data.message };
            } catch (err) {
                return { store, success: false, message: err.message };
            }
        }));
        // Show summary
        const allSuccess = results.every(r => r.success);
        if (allSuccess) {
            toast.success(`Orders placed for: ${results.map(r => r.store).join(', ')}`);
            setCartItems({});
            // Clear applied promo code after successful order
            localStorage.removeItem('appliedPromoCode');
            navigate("/myorders");
        } else {
            results.forEach(r => {
                if (!r.success) toast.error(`Order for ${r.store} failed: ${r.message}`);
            });
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token, getTotalCartAmount, navigate])

    useEffect(() => {
        const emailToUse = userEmail || (firebaseUser && firebaseUser.email) || "";
        if (emailToUse) {
            setData(data => ({ ...data, email: emailToUse }));
        }
    }, [firebaseUser, userEmail]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Collection Information</p>
                <input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Name' required />
                <input type="text" name='class' onChange={onChangeHandler} value={data.class} placeholder='Class' required />
                <select name='secondaryLevel' onChange={onChangeHandler} value={data.secondaryLevel} required>
                  <option value="" disabled>Select Secondary level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <input type="email" name='email' value={data.email} placeholder='Email' readOnly />
                <div className='order-date-picker'>
                  <p>Select Order Date</p>
                  <input
                    type="date"
                    value={orderDate}
                    min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
                    onChange={e => setOrderDate(e.target.value)}
                    required
                  />
                </div>
                <div className='order-time-picker'>
                  <p>Select Collection Time</p>
                  <input
                    type="time"
                    value={collectionTime}
                    min="07:00"
                    max="18:00"
                    onChange={e => setCollectionTime(e.target.value)}
                    required
                  />
                  <small>Available times: 7:00 AM - 6:00 PM</small>
                </div>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    
                    {/* Order Items List */}
                    <div className="order-items-list">
                        {Object.entries(cartItems).map(([cartKey, quantity]) => {
                            if (quantity > 0) {
                                const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
                                const item = food_list.find(food => food._id === itemId);
                                
                                if (item) {
                                    let sideDishes = [];
                                    let totalPrice = item.price;
                                    
                                    // Parse side dishes if present
                                    if (cartKey.includes('_')) {
                                        try {
                                            const underscoreIndex = cartKey.indexOf('_');
                                            const encodedSideDishes = cartKey.substring(underscoreIndex + 1);
                                            const sideDishesJson = atob(encodedSideDishes);
                                            sideDishes = JSON.parse(sideDishesJson);
                                            const sideDishesTotal = sideDishes.reduce((sum, sd) => sum + sd.price, 0);
                                            totalPrice = item.price + sideDishesTotal;
                                        } catch (e) {
                                            console.error('Error parsing side dishes:', e);
                                        }
                                    }
                                    
                                    return (
                                        <div key={cartKey} className="order-item">
                                            <div className="order-item-details">
                                                <div className="order-item-name">{item.name}</div>
                                                {sideDishes.length > 0 && (
                                                    <div className="order-item-side-dishes">
                                                        <div className="order-item-side-dishes-label">Side Dishes:</div>
                                                        {sideDishes.map((sideDish, index) => (
                                                            <span key={index} className="order-item-side-dish">
                                                                {sideDish.name} (+{currency}{Number(sideDish.price).toFixed(2)})
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="order-item-price">
                                                {currency}{Number(totalPrice).toFixed(2)}
                                                <span className="order-item-quantity">× {quantity}</span>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            return null;
                        })}
                    </div>
                    
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{Number(subtotal).toFixed(2)}</p></div>
                        {appliedPromoCode && promoDiscountAmount > 0 && (
                            <>
                                <div className="cart-total-details" style={{color: 'green'}}>
                                    <p>Promo Discount ({appliedPromoCode.code})</p>
                                    <p>-{currency}{promoDiscountAmount.toFixed(2)}</p>
                                </div>
                                <hr />
                            </>
                        )}
                        <div className="cart-total-details"><b>Total</b><b>{currency}{Number(total).toFixed(2)}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div className="payment-option-static">
                        <p>Cash on Delivery</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>Place Order</button>
            </div>
        </form>
    )
}

export default PlaceOrder
