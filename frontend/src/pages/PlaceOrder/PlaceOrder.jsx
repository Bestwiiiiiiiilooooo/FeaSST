import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState({
        name: "",
        class: "",
        secondaryLevel: "",
        email: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,currency,deliveryCharge,userId,firebaseUser,userEmail } = useContext(StoreContext);

    const navigate = useNavigate();

    const [orderDate, setOrderDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        // Group items by store/category
        const itemsByStore = {};
        orderItems.forEach(item => {
            if (!itemsByStore[item.category]) itemsByStore[item.category] = [];
            itemsByStore[item.category].push(item);
        });
        // Place an order for each store
        const results = await Promise.all(Object.entries(itemsByStore).map(async ([store, items]) => {
            const orderData = {
                userId,
                address: data,
                items,
                amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                stallId: store,
                orderDate,
            };
            try {
                if (payment === "stripe") {
                    let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${token}` } });
                    return { store, success: response.data.success, message: response.data.success ? 'Stripe order placed' : response.data.message };
                } else {
                    let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { Authorization: `Bearer ${token}` } });
                    return { store, success: response.data.success, message: response.data.message };
                }
            } catch (err) {
                return { store, success: false, message: err.message };
            }
        }));
        // Show summary
        const allSuccess = results.every(r => r.success);
        if (allSuccess) {
            toast.success(`Orders placed for: ${results.map(r => r.store).join(', ')}`);
            setCartItems({});
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
    }, [token])

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
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email' required />
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
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment==="cod"?"Place Order":"Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder
