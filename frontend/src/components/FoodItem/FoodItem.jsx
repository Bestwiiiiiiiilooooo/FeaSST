import React, { useContext, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import SideDishesPopup from '../SideDishesPopup/SideDishesPopup';

const FoodItem = ({ image, name, price, desc, id, sideDishes, isAvailable = true }) => {

    const [showSideDishesPopup, setShowSideDishesPopup] = useState(false);
    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);

    const handleAddToCart = useCallback((food, selectedSideDishes) => {
        addToCart(id, selectedSideDishes);
    }, [addToCart, id]);

    const cartKey = useMemo(() => {
        // Check if this item exists in cart with any side dishes combination
        for (const key in cartItems) {
            if (key.startsWith(id)) {
                return key;
            }
        }
        return null;
    }, [cartItems, id]);

    const cartQuantity = useMemo(() => {
        return cartKey ? cartItems[cartKey] : 0;
    }, [cartKey, cartItems]);

    const handleClosePopup = useCallback(() => {
        setShowSideDishesPopup(false);
    }, []);

    return (
        <div className={`food-item ${!isAvailable ? 'sold-out' : ''}`}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url+"/images/"+image} alt="" />
                {!isAvailable ? (
                    <div className="sold-out-overlay">
                        <span>SOLD OUT</span>
                    </div>
                ) : (
                    !cartQuantity
                    ?<img className='add' onClick={() => setShowSideDishesPopup(true)} src={assets.add_icon_white} alt="" />
                    :<div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={()=>removeFromCart(cartKey)} alt="" />
                            <p>{cartQuantity}</p>
                            <img src={assets.add_icon_green} onClick={()=>setShowSideDishesPopup(true)} alt="" />
                        </div>
                    )
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>

            {showSideDishesPopup && createPortal(
                <SideDishesPopup
                    food={{ id, name, price, desc, image, sideDishes }}
                    onClose={handleClosePopup}
                    onAddToCart={handleAddToCart}
                />,
                document.body
            )}
        </div>
    )
}

export default FoodItem
